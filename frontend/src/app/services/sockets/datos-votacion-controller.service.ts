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
  codigo;
  hasResults = false;

  constructor() {}

  clearData() {
    this.lista = null;
    this.total = null;
    this.socketsConnected = [];
    this.listsReceived = [];
    this.canVote = false;
    this.results = [];
    this.codigo = null;
  }

  activateHasResults() {
    this.hasResults = true;
  }

  getHasResults() {
    return this.hasResults;
  }

  setLista(lista) {
    this.hasResults = false;
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

  getCodigo() {
    return this.codigo
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
