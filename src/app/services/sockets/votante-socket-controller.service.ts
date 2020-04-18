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
  messagesFase1 = [];

  constructor(private config: ConfigurationService, private controllerVotacion: DatosVotacionControllerService, private senderController: SenderMessageControllerService ) {}
  
  createSocketVotante(port, token) {
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
      this.sendMessage({fase: 0, data: "OK"})
    } else if (fase == "A3") {
      this.controllerVotacion.changeCanVote();
    } else {
      this.controlDesencriptadosVotante(fase, data);
    }
  }


  controlDesencriptadosVotante(fase, data) {
    if (fase == "1") {
      this.messagesFase1.push(data);

      if (this.messagesFase1.length == this.controllerVotacion.getParticipants()) {
        this.senderController.controlFaseFirstPart(this.messagesFase1).then(res => {
          this.sendMessages(res);
        });
      }
    } else {
      var senderMethod;

      if (fase == "2") {
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
        //ERROR
      }

      senderMethod.then(res => {
        if (res != false) {
          this.sendMessages(res);
        }
      }).catch(err => {
        console.log("ERROR")
      });

    }  
  }

  sendMessage(data) {
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
