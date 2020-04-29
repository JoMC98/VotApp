import { Injectable } from '@angular/core';
import { ConfigurationService } from '../general/configuration.service';
import { DatosVotacionControllerService } from './datos-votacion-controller.service';
import { SenderMessageControllerService } from './sender-message-controller.service';

@Injectable({
  providedIn: 'root'
})
export class VotanteSocketControllerService {

  ws;
  lista;
  alteracion = false;
  error = false;
  stop = false;
  cerrado = false;

  constructor(private config: ConfigurationService, private controllerVotacion: DatosVotacionControllerService, private senderController: SenderMessageControllerService ) {}
  
  createSocketVotante(port, token) {
    this.cerrado = false;
    this.ws = new WebSocket(this.config.SOCKET_URL + port);
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
      this.sendMessage({fase: 0, data: "OK"})
    } else if (fase == "A3") {
      this.controllerVotacion.changeCanVote();
    } 
    else if (fase == "ALT") {
      this.alteracion = true;
      this.controllerVotacion.activateAlteracion();
      this.endVotacionError();
    } 
    else if (fase == "ERR") {
      this.error = true;
      this.controllerVotacion.activateError();
      this.endVotacionError();
    } 
    else if (fase == "STOP") {
      this.stop = true;
      this.controllerVotacion.activateStop();
      this.endVotacionError();
    } 
    else if (fase == "END") {
      this.controllerVotacion.activateHasResults();
      this.sendMessageDestino(null, "END-OK", null);  
      this.clearData();
    } 
    else {
      if (!this.alteracion && !this.error && !this.stop) {
        this.controlDesencriptadosVotante(fase, data);
      }
    }
  }

  controlDesencriptadosVotante(fase, data) {
    var senderMethod;
    if (fase == "1") {
      senderMethod = this.senderController.controlFaseFirstPart(data)
    } else if (fase == "2") {
      senderMethod = this.senderController.controlFaseFirstPart(data)
    } else if (fase == "3") {
      senderMethod = this.senderController.controlFaseSecondPart(data, true)
    } else if (fase == "4") {
      senderMethod = this.senderController.controlFaseSecondPart(data, false)
    } else if (fase == "F") {
      senderMethod = this.senderController.controlCheckSign(data, false);
    } else if (fase == "FA") {
      senderMethod = this.senderController.controlCheckSign(data, true);
    } else if (fase == "Y") {
      senderMethod = this.senderController.controlLastString(data);
    } else {
      return;
    }

    senderMethod.then(res => {
      if (res != false) {
        this.sendMessages(res);
      }
    }).catch(err => {
      this.avisarAlteracion();
    }); 
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
