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

  async modificarOpcionesVotacion(data) { return await this.httpRequest.postRequest("/modificarOpcionesVotacion", data) };
  async modificarParticipantesVotacion(data) { return await this.httpRequest.postRequest("/modificarParticipantesVotacion", data) };
  async filtrarUsuarios(filtros) { return await this.httpRequest.postRequest("/filtrarUsuarios", filtros) };
  async filtrarVotaciones(filtros) { return await this.httpRequest.postRequest("/filtrarVotaciones", filtros) };
  async obtenerHomeVotaciones() { return await this.httpRequest.getRequest("/obtenerHomeVotaciones")};
  async activarVotacion(codigo) { return await this.httpRequest.getRequest("/activarVotacion/" + codigo)};
  async privateKeyAdmin(codigo) { return await this.httpRequest.getRequest("/privateKeyAdmin/" + codigo)};
  async obtenerDatosVotacion(codigo) { return await this.httpRequest.getRequest("/obtenerDatosVotacion/" + codigo)};
  async cerrarVotacionError(codigo) { return await this.httpRequest.getRequest("/cerrarVotacionError/" + codigo)};
  async obtenerEstadoVotacionVotante(codigo) { return await this.httpRequest.getRequest("/obtenerEstadoVotacionVotante/" + codigo)};

  async añadirUsuario(usuario) { 
    return await new Promise((resolve, reject) => {
      this.httpRequest.postRequest("/nuevoUsuario", {nuevoUsuario: usuario}).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  };

  async modificarUsuario(usuario) { 
    return await new Promise((resolve, reject) => {
      this.httpRequest.postRequest("/modificarUsuario", usuario).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  };

  async modificarContraseña(passwords) { 
    return await new Promise((resolve, reject) => {
      this.httpRequest.postRequest("/modificarContrasenya", passwords).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  };

  async modificarContraseñaFirst(data) { 
    return await new Promise((resolve, reject) => {
      this.httpRequest.postRequest("/modificarContrasenyaFirst", data).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  };

  async añadirVotacion(data) { 
    return await new Promise((resolve, reject) => {
      this.httpRequest.postRequest("/nuevaVotacion", data).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  };


  async modificarVotacion(votacion) { 
    return await new Promise((resolve, reject) => {
      this.httpRequest.postRequest("/modificarVotacion", votacion).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  };

  addTemporalUser(usuario) { 
    this.temporalUser = usuario;
  }

  getTemporalUser() {
    var t = this.temporalUser;
    this.temporalUser = {DNI: "", nombre: "", apellidos: "", mail: "", telefono: "", cargo: "", departamento: "", f_registro: ""};
    return t;
  }
}
