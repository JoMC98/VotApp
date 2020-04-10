import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionControllerService } from '../authentication/session-controller.service';
import { LoginControllerService } from '../authentication/login-controller.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  private REST_API_SERVER = "http://192.168.1.135:4400";
  // private REST_API_SERVER = "https://proyecto.al361869.al.nisu.org:4300";

  constructor(private http: HttpClient, private sessionController: SessionControllerService, private loginController: LoginControllerService, private router: Router) {
  }

  async getRequest(requestPath) {
    var url = this.REST_API_SERVER + requestPath
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
    var url = this.REST_API_SERVER + requestPath
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
    if (error["error"].status == "Token Not Valid") {
      this.loginController.logout()
    } else if (error["error"].status == "Token Not Found") {
      this.loginController.logout()
    } else if (error["error"].status == "Restricted Access") {
      this.router.navigate(["/restrictedAccess"]);
    }
  }

}