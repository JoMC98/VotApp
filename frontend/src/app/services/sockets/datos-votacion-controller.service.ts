import { Injectable } from '@angular/core';
import { KeyPasswordControllerService } from '../cipher/key-password-controller.service';

@Injectable({
  providedIn: 'root'
})
export class DatosVotacionControllerService {

  clavePrivada = null;
  clavePrivadaEncrypted = null;
  logged = false;

  lista;
  total;
  socketsConnected = [];
  listsReceived = [];
  canVote = false;
  codigo;
  hasResults = {result: false, alteracion: false, error: false, stop: false};

  constructor(private kewPasswordController: KeyPasswordControllerService) {}

  clearData() {
    this.lista = null;
    this.total = null;
    this.socketsConnected = [];
    this.listsReceived = [];
    this.canVote = false;
    this.codigo = null;

    this.clavePrivada = null;
    this.clavePrivadaEncrypted = null;
    this.logged = false;
  }

  //LOGIN

  async tryDecryptPrivateKey(password) {
    return await new Promise((resolve, reject) => {
      if (this.clavePrivadaEncrypted == null) {
        reject(null)
      } else {
        this.kewPasswordController.decryptPrivateKey(password, this.clavePrivadaEncrypted)
          .then(clavePrivada => {
            this.clavePrivada = clavePrivada
            this.logged = true;
            resolve(true)
          })
          .catch(() => {
            resolve(false)
          })
      }
    })
  }

  isLogged() {
    return this.logged
  }

  setEncryptedPrivateKey(key) {
    this.clavePrivadaEncrypted = key;
  }

  deletePrivateKey() {
    this.clavePrivada = null;
  }

  getPrivateKey() {
    return this.clavePrivada;
  }

  //GETTERS

  getHasResults() {
    return this.hasResults;
  }

  getLista() {
    return this.lista;
  }

  getCodigo() {
    return this.codigo
  }

  getIp(id) {
    return this.lista.list[id].ip;
  }

  getParticipants() {
    return this.total / 2;
  }

  getOrder() {
    return this.lista.order;
  }

  getStatus() {
    var completed = this.socketsConnected.filter(element => this.listsReceived.includes(element));
    var progress = ((this.socketsConnected.length + this.listsReceived.length) / this.total) * 100
    return {progress: progress, completed: completed, total: this.total/2}
  }

  getCanVote() {
    return this.canVote;
  }


  //SETTERS
  activateHasResults() {
    this.hasResults.result = true;
  }

  activateAlteracion() {
    this.hasResults.alteracion = true;
  }
  
  activateError() {
    this.hasResults.error = true;
  }

  activateStop() {
    this.hasResults.stop = true;
  }

  setLista(lista) {
    this.hasResults = {result: false, alteracion: false, error: false, stop: false};
    this.lista = lista
    if (this.lista.list) {
      this.total = Object.keys(this.lista.list).length * 2;
    } else {
      this.total = Object.keys(this.lista).length * 2;
    }
  }

  setCodigo(codigo) {
    this.codigo = codigo
  }

  addConnectionSocket(dni) {
    this.socketsConnected.push(dni)
  }

  addListReceived(dni) {
    this.listsReceived.push(dni)
  }

  changeCanVote() {
    this.canVote = true;
  }
}
