import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionControllerService } from './session-controller.service';
import { Router } from '@angular/router';
import { ConfigurationService } from '../general/configuration.service';
import { PushControllerService } from '../notifications/push-controller.service';
import { rejects } from 'assert';
import { ConnectionControllerService } from '../general/connection-controller.service';

@Injectable({
  providedIn: 'root'
})
export class LoginControllerService {

  constructor(private http: HttpClient, private sessionController: SessionControllerService, 
    private router: Router, private config: ConfigurationService, private connectionController: ConnectionControllerService) {
  }

  async login(credenciales) { 
    var url = this.config.DB_API_SERVER + "/login"
    return await new Promise((resolve, reject) => {
      this.http.post(url, credenciales)
      .subscribe(
        (data: any[]) => {
          this.sessionController.storeSession(data);
          resolve(true);
        },
        (error: any[]) => {
          if (error["status"] == 401) {
            reject(true)
          } else {
            if (this.connectionController.getIsConected()) {
              console.log("ERROR UKNOWN")
            } else {
              console.log("ERROR DE RED")
            }
            reject(false)
          }
        });
    });
  };

  logout() { 
    this.sessionController.deleteSession();
    this.router.navigate(['/login']);
  }
}
