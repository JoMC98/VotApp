import { Injectable } from '@angular/core';
import { ConfigurationService } from '../general/configuration.service';
import { DatosVotacionControllerService } from './datos-votacion-controller.service';

@Injectable({
  providedIn: 'root'
})
export class AdminSocketControllerService {

  ws;

  constructor(private config: ConfigurationService, private controllerVotacion: DatosVotacionControllerService) {}

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
      //GUARDAR LISTA
      this.controllerVotacion.setLista(data);
    } else if (fase == "A1") {
      console.log("Connected to socket " + data)
      this.controllerVotacion.addConnectionSocket(data);
    } else if (fase == "A2") {
      console.log("List received " + data)
      this.controllerVotacion.addListReceived(data);
    }
  }

  sendMessage(data) {
    console.log("SEND")
    this.ws.send(JSON.stringify(data));
  }


}
