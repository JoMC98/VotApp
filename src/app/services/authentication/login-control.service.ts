import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginControlService {
  currentUserSubject: BehaviorSubject<User>;
  currentUser: Observable<User>;

  private REST_API_SERVER = "http://192.168.1.135:4400";
  // private REST_API_SERVER = "https://proyecto.al361869.al.nisu.org:4300";

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  login(dni: string, passwd: string) {
    var url = this.REST_API_SERVER + "/login"
    var body = {dni: dni, passwd: passwd}
    return this.http.post<any>(url, body)
      .pipe(map(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
      }));
  }

  logout() {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }
}
