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

  constructor(private config: ConfigurationService, private controllerVotacion: DatosVotacionControllerService, 
    private senderController: SenderMessageControllerService, private controllerBD: DatabaseControllerService) {}

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
      if (!this.alteracion && !this.error) {
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
        var lista = this.controllerVotacion.getLista();
        var messages = []
        messages.push({ip: "admin", fase: "ALT", data: "ALTERACION"});
        for (var key of Object.keys(lista)) {
          var ip = lista[key]["ip"];
          messages.push({ip: ip, fase: "ALT", data: "ALTERACION"});
        }
        this.sendMessages(messages);
      });
    } else if (fase == "Z") {
      this.messagesFaseZ.push(data);
      if (this.messagesFaseZ.length == this.controllerVotacion.getParticipants()) {
        this.endVotacion();
      }
    } else if (fase == "ALT") {
      this.alteracion = true;
      this.controllerVotacion.activateAlteracion();
      this.endVotacionError();

    } else if (fase == "ERR") {
      this.error = true;
      this.controllerVotacion.activateError();
      this.endVotacionError();
    }
  }

  endVotacionError() {
    this.sendMessageDestino(null, "END-OK", null);  
    this.clearData()
  }

  clearData() {
    this.senderController.clearData();
    this.ws = null;
    this.messagesFaseZ = [];
  }

  endVotacion() {
    var results = this.controllerVotacion.getResults();
    var codigo = this.controllerVotacion.getCodigo();
    this.controllerBD.obtenerResultadosVotacion(codigo).then(res => {
      var votos = []
      for (var i of Object.keys(res["resultados"])) {
        var opt = res["resultados"][i]
        var total_votos = results.filter(x => x == opt.opcion).length
        votos.push([codigo, opt.opcion, total_votos])
      }

      this.controllerBD.añadirResultadosVotacion(codigo, {votos: votos}).then(r => {
        this.sendMessageDestino(null, "END", null);
        this.controllerVotacion.activateHasResults();
        this.clearData();
      }).catch(err => {
        console.log(err)
      })
    })
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
