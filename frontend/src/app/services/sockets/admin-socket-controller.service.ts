import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '../general/configuration.service';
import { DatosVotacionControllerService } from './datos-votacion-controller.service';
import { SenderMessageControllerService } from './sender-message-controller.service';
import { DatabaseControllerService } from '../database/database-controller.service';

@Injectable({
  providedIn: 'root'
})
export class AdminSocketControllerService {

  ws;
  messagesFaseZ = [];
  alteracion = false;
  error = false;
  cerrado = false;
  stop = false;

  constructor(private config: ConfigurationService, private controllerVotacion: DatosVotacionControllerService, 
    private senderController: SenderMessageControllerService, private controllerBD: DatabaseControllerService, private router: Router) {}

  createSocketAdmin(port, token) {
    this.cerrado = false;
    this.ws = new WebSocket(this.config.SOCKET_URL + port);
    this.ws.onerror = (event) => {
      this.clearData()
      this.router.navigate(["/restrictedAccess"]);
    }
    this.sendToken(token);
    this.controlMessages();
  }

  sendToken(token) {
    this.ws.onopen = (event) => {
      this.sendMessage({token: token})
    };
  }

  controlMessages() {
    this.ws.onmessage = (event) => {
      this.controlFases(JSON.parse(event.data))
    };
  }

  controlFases(message) {
    var fase = message.fase
    var data = message.data
    
    console.log("FASE: " + fase)

    if (fase == "0") {
      this.controllerVotacion.setLista(data);
    } else if (fase == "A1") {
      this.controllerVotacion.addConnectionSocket(data);
    } else if (fase == "A2") {
      this.controllerVotacion.addListReceived(data);
    } else if (fase == "ALT") {
      this.alteracion = true;
      this.controllerVotacion.activateAlteracion();
      this.endVotacionError();
    } else if (fase == "ERR") {
      this.error = true;
      this.controllerVotacion.activateError();
      this.endVotacionError();
    } else if (fase == "STOP") {
        this.stop = true;
        this.controllerVotacion.activateStop();
        this.endVotacionError();
    } else {
      if (!this.alteracion && !this.error && !this.stop) {
        this.controlDesencriptadosAdmin(fase, data);
      }
    }
  }

  controlDesencriptadosAdmin(fase, data) {
    if (fase == "X") {
      this.senderController.controlDesencriptadoAdmin(data).then(res => {
        if (res != false) {
          this.sendMessages(res);
        }
      }).catch(err => {
        this.avisarAlteracion()
      });
    } else if (fase == "END") {
      this.controllerVotacion.activateHasResults();
      this.sendMessageDestino(null, "END-OK", null);  
      this.clearData();
    } 
  }

  avisarAlteracion() {
    this.alteracion = true;
    this.sendMessageDestino(null, "ALT", "ALTERACION")
  }

  endVotacionError() {
    this.sendMessageDestino(null, "END-OK", null);  
    this.clearData()
  }

  clearData() {
    console.log("CLEARING DATA")
    this.cerrado = true;
    this.senderController.clearData();
    this.ws = null;
    this.messagesFaseZ = [];
  }

  sendMessage(data) {
    if (!this.cerrado) {
      this.ws.send(JSON.stringify(data));
    }
  }

  sendMessages(res) {
    if (res != null) {
      for (var m of res) {
        this.sendMessageDestino(m.ip, m.fase, m.data);
      }
    }
  }

  sendMessageDestino(ip, fase, data) {
    var message = {fase: fase, data: data}
    var response = {"destino" : ip, "message" : message};
    console.log("Send fase " + fase + " to " + ip)
    if (!this.cerrado) {
      this.ws.send(JSON.stringify(response));
    }
  }


}
