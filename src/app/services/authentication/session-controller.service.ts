import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const DNI_KEY = 'auth-dni';
const NAME_KEY = 'auth-nombre';
const SURNAME_KEY = 'auth-apellidos';
const ADMIN_KEY = 'auth-admin';

const KEYS = [TOKEN_KEY, DNI_KEY, NAME_KEY, SURNAME_KEY, ADMIN_KEY];

@Injectable({
  providedIn: 'root'
})
export class SessionControllerService {

  constructor() { }

  storeSession(user) {
    this.deleteSession();
    window.sessionStorage.setItem(TOKEN_KEY, user.token);
    window.sessionStorage.setItem(DNI_KEY, user.DNI);
    window.sessionStorage.setItem(NAME_KEY, user.nombre);
    window.sessionStorage.setItem(SURNAME_KEY, user.apellidos);
    window.sessionStorage.setItem(ADMIN_KEY, user.admin);
  }

  getSession() {
    var user = {}
    user["token"] =  this.getTokenSession();
    user["dni"] = this.getDNISession();
    user["nombre"] = this.getNombreSession();
    user["apellidos"] = this.getApellidosSession();
    user["admin"] = this.getAdminSession();
    
    return user;
  }

  getTokenSession() {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  getDNISession() {
    return window.sessionStorage.getItem(DNI_KEY);
  }

  getNombreSession() {
    return window.sessionStorage.getItem(NAME_KEY);
  }

  getApellidosSession() {
    return window.sessionStorage.getItem(SURNAME_KEY);
  }

  getAdminSession() {
    return JSON.parse(window.sessionStorage.getItem(ADMIN_KEY));
  }

  deleteSession() {
    for (var key of KEYS) {
      window.sessionStorage.removeItem(key);
    }
  }
}
