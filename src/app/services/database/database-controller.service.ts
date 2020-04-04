import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseControllerService {
  temporalUser = {DNI: "", nombre: "", apellidos: "", mail: "", telefono: "", cargo: "", departamento: "", f_registro: ""};

  constructor(private httpRequest: HttpRequestService) {}

  async obtenerVotaciones() { return await this.httpRequest.getRequest("/obtenerVotaciones") };
  async obtenerVotacion(codigo) { return await this.httpRequest.getRequest("/obtenerVotacion/" + codigo) };
  async obtenerUsuarios() { return await this.httpRequest.getRequest("/obtenerUsuarios") };
  async obtenerUsuario(dni) { return await this.httpRequest.getRequest("/obtenerUsuario/" + dni) };
  async obtenerOpcionesVotacion(codigo) { return await this.httpRequest.getRequest("/obtenerOpcionesVotacion/" + codigo) };
  async obtenerParticipantesVotacion(codigo) { return await this.httpRequest.getRequest("/obtenerParticipantesVotacion/" + codigo) };
  async obtenerResultadosVotacion(codigo) { return await this.httpRequest.getRequest("/obtenerResultadosVotacion/" + codigo) };
  async obtenerUsuariosFueraVotacion(participantes) { return await this.httpRequest.postRequest("/obtenerUsuariosFueraVotacion", participantes) };

  //TODO FALTA ENVIARLE CLAVE PUBLICA Y DNI_ADMIN para añadir a votante Y PRIVADA
  async añadirUsuario(usuario) { return await this.httpRequest.postRequest("/nuevoUsuario", {usuario: usuario, clavePublica:"AA", dni_admin: "12345678A"}) };
  //TODO FALTA ENVIARLE DNI_ADMIN para añadir a votante
  async añadirVotacion(data) { return await this.httpRequest.postRequest("/nuevaVotacion", data) };

  async modificarUsuario(usuario) { return await this.httpRequest.postRequest("/modificarUsuario", usuario) };
  //TODO FALTA ENVIARLE CLAVE PUBLICA Y PRIVADA
  async modificarContraseña(passwords) { return await this.httpRequest.postRequest("/modificarContrasenya", passwords) };

  async modificarVotacion(votacion) { return await this.httpRequest.postRequest("/modificarVotacion", votacion) };
  async modificarOpcionesVotacion(data) { return await this.httpRequest.postRequest("/modificarOpcionesVotacion", data) };
  async modificarParticipantesVotacion(data) { return await this.httpRequest.postRequest("/modificarParticipantesVotacion", data) };

  async filtrarUsuarios(filtros) { return await this.httpRequest.postRequest("/filtrarUsuarios", filtros) };
  async filtrarVotaciones(filtros) { return await this.httpRequest.postRequest("/filtrarVotaciones", filtros) };

  addTemporalUser(usuario) { 
    this.temporalUser = usuario;
  }

  getTemporalUser() {
    var t = this.temporalUser;
    this.temporalUser = {DNI: "", nombre: "", apellidos: "", mail: "", telefono: "", cargo: "", departamento: "", f_registro: ""};
    return t;
  }
}
