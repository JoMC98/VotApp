import { Injectable } from '@angular/core';
import { PushControllerService } from '../notifications/push-controller.service';
import { ConfigurationService } from '../general/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class SessionControllerService {

  constructor(private pushService: PushControllerService, private config: ConfigurationService) { }

  storeSession(user) {
    console.log("STORE SESSION")
    this.deleteSession();
    window.sessionStorage.setItem(this.config.TOKEN_KEY, user.token);
    window.sessionStorage.setItem(this.config.DNI_KEY, user.DNI);
    window.sessionStorage.setItem(this.config.NAME_KEY, user.nombre);
    window.sessionStorage.setItem(this.config.SURNAME_KEY, user.apellidos);
    window.sessionStorage.setItem(this.config.ADMIN_KEY, user.admin);
    this.pushService.subscribe(user.token);
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
    return window.sessionStorage.getItem(this.config.TOKEN_KEY);
  }

  getDNISession() {
    return window.sessionStorage.getItem(this.config.DNI_KEY);
  }

  getNombreSession() {
    return window.sessionStorage.getItem(this.config.NAME_KEY);
  }

  getApellidosSession() {
    return window.sessionStorage.getItem(this.config.SURNAME_KEY);
  }

  getAdminSession() {
    return JSON.parse(window.sessionStorage.getItem(this.config.ADMIN_KEY));
  }

  deleteSession() {
    for (var key of this.config.SESSION_KEYS) {
      window.sessionStorage.removeItem(key);
    }
  }
}
