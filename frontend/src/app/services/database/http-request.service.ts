import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionControllerService } from '../authentication/session-controller.service';
import { LoginControllerService } from '../authentication/login-controller.service';
import { Router } from '@angular/router';
import { ConfigurationService } from '../general/configuration.service';
import { ConnectionControllerService } from '../general/connection-controller.service';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(private http: HttpClient, private sessionController: SessionControllerService, private loginController: LoginControllerService, 
    private router: Router, private config: ConfigurationService, private connectionController: ConnectionControllerService) {
  }

  async getRequest(requestPath) {
    var url = this.config.DB_API_SERVER + requestPath
    var options = this.getOptions();

    return await new Promise((resolve, reject) => {
      this.http.get(url, options).subscribe(
        (data: any[])=>{
          resolve(data);
        },
        (error: any[]) => {
          this.errorControl(error);
        }
      );
    });
  }

  async postRequest(requestPath, body) {
    var url = this.config.DB_API_SERVER + requestPath
    var options = this.getOptions();

    return await new Promise((resolve, reject) => {
      this.http.post(url, body, options)
      .subscribe(
        (data: any[])=>{
          resolve(data);
        },
        (error: any[]) => {
          this.errorControl(error);
        }
      );
    });
  }

  getOptions() {
    var token = this.sessionController.getTokenSession();
    var options = {
    headers: new HttpHeaders({ 
      authorization: "Bearer " + token
    })
    }
    return options;
  }

  errorControl(error) {
    console.log(error)
    if (error.status == 401) {
      this.loginController.logout()
    } else if (error.status == 403) {
      this.router.navigate(["/restrictedAccess"]);
    } else if (error.status == 500) {
      this.router.navigate(["/serverError"]);
    } else {
      if (this.connectionController.getIsConected()) {
        console.log("ERROR UKNOWN")
      } else {
        console.log("ERROR DE RED")
      }
      //OTROS ERRORES
      this.router.navigate(["/serverError"]);
    }
  }

}