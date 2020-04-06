import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  private REST_API_SERVER = "http://192.168.1.135:4400";
  //private REST_API_SERVER = "http://150.128.97.91:4300";

  constructor(private http: HttpClient) { }

  async getRequest(requestPath) {
    var url = this.REST_API_SERVER + requestPath
    return await new Promise((resolve, reject) => {
      this.http.get(url).subscribe((data: any[])=>{
        resolve(data);
      });
    });
  }


  async postRequest(requestPath, body) {
    var url = this.REST_API_SERVER + requestPath
    return await new Promise((resolve, reject) => {
      this.http.post(url, body).subscribe((data: any[])=>{
        resolve(data);
      });
    });
  }
}
