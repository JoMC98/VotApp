import { Injectable } from '@angular/core';
import { ConfigurationService } from '../general/configuration.service';
import { DatosVotacionControllerService } from './datos-votacion-controller.service';
import { SenderMessageControllerService } from './sender-message-controller.service';

@Injectable({
  providedIn: 'root'
})
export class AdminSocketControllerService {

  ws;
  messagesFaseZ = [];

  constructor(private config: ConfigurationService, private controllerVotacion: DatosVotacionControllerService, private senderController: SenderMessageControllerService) {}

  createSocketAdmin(port, token) {
    this.ws = new WebSocket(this.config.SOCKET_URL + port);
    this.sendToken(token);
    this.controlMessages();
  }

  sendToken(token) {
    console.log("CONTROL OPEN")
    this.ws.onopen = (event) => {
      console.log("WebSocket is open now.");
      this.sendMessage({token: token})
    };
  }

  controlMessages() {
    console.log("CONTROL MESSAGE")
    this.ws.onmessage = (event) => {
      //COMUNICAR CON CONTROLADOR DE ESTADO Y PASAR LISTA??
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
    } else {
      this.controlDesencriptadosAdmin(fase, data);
    }
  }

  controlDesencriptadosAdmin(fase, data) {
    if (fase == "X") {
      this.senderController.controlDesencriptadoAdmin(data).then(res => {
        if (res != false) {
          this.sendMessages(res);
        }
      }).catch(err => {
        console.log("ERROR")
      });
    } else if (fase == "Z") {
      this.messagesFaseZ.push(data);
      if (this.messagesFaseZ.length == this.controllerVotacion.getParticipants()) {
        console.log(this.controllerVotacion.getResults())
      }
    } else {
       //ERROR
    }
  }

  sendMessage(data) {
    console.log("SEND")
    this.ws.send(JSON.stringify(data));
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
    this.ws.send(JSON.stringify(response));
  }


}
