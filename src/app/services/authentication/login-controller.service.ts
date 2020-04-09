import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionControllerService } from './session-controller.service';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginControllerService {

  private REST_API_SERVER = "http://192.168.1.135:4400";
  // private REST_API_SERVER = "https://proyecto.al361869.al.nisu.org:4300";

  constructor(private http: HttpClient, private sessionController: SessionControllerService, private router: Router) { }

  async login(credenciales) { 
    var url = this.REST_API_SERVER + "/login"
    return await new Promise((resolve, reject) => {
      this.http.post(url, credenciales)
      .subscribe(
        (data: any[]) => {
          this.sessionController.storeSession(data);
          resolve(true);
        },
        (error: any[]) => {
          reject(error)
        }
      );
    });
  };

  logout() { 
    this.sessionController.deleteSession();
    this.router.navigate(['/login']);
  }
}
