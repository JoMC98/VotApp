import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosVotacionControllerService {

  lista;
  total;
  socketsConnected = [];
  listsReceived = [];
  canVote = false;
  results = [];

  constructor() {}

  setLista(lista) {
    this.lista = lista
    if (this.lista.list) {
      this.total = Object.keys(this.lista.list).length * 2;
    } else {
      this.total = Object.keys(this.lista).length * 2;
    }
  }

  getLista() {
    return this.lista;
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

  addConnectionSocket(dni) {
    this.socketsConnected.push(dni)
  }

  addListReceived(dni) {
    this.listsReceived.push(dni)
  }

  getStatus() {
    var completed = this.socketsConnected.filter(element => this.listsReceived.includes(element));
    var progress = ((this.socketsConnected.length + this.listsReceived.length) / this.total) * 100
    return {progress: progress, completed: completed, total: this.total/2}
  }

  getCanVote() {
    return this.canVote;
  }

  changeCanVote() {
    this.canVote = true;
  }

  setResults(results) {
    this.results = results;
  }

  getResults() {
    return this.results;
  }
}
