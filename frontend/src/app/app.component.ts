import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { Router } from '@angular/router';
import { SessionControllerService } from './services/authentication/session-controller.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  footer:boolean = true;
  login:boolean = false;
  admin:boolean;

  bannedPages = ["/nuevaVotacion", "/nuevoUser", "/users", ]
  bannedPagesContains = "/iniciarVotacion"
  dependingBannedPagesByDNI = ["/user", "/modifyUser"]
  bannedChange = "/changePasswd"

  constructor(private router: Router, private sessionController: SessionControllerService) {
    this.admin = sessionController.getAdminSession();
  }

  checkRutaNotAdmin(pagina) {
    if (this.bannedPages.includes(pagina)) {
      this.router.navigate(["/home"]);
    } else if (pagina.includes(this.bannedPagesContains)) {
      this.router.navigate(["/home"]);
    } else {
      for (var page of this.dependingBannedPagesByDNI) {
        if (pagina.includes(page)) {
          var dni = this.sessionController.getDNISession();
          var dni_url = pagina.split("/")[2].split("?")[0];
          if (dni != dni_url) {
            this.router.navigate(["/home"]);
          }
        }
      }
    }
  }

  checkChangePasswd() {
    var changePasswd = this.sessionController.getChangePasswdSession();
    return changePasswd;
  }

  checkSession() {
    var dni = this.sessionController.getDNISession();
    if (dni != null) {
      return true;
    } else {
      return false;
    }
  }
  
  cambiaRuta() {
    this.admin = this.sessionController.getAdminSession();

    var pagina = this.router.url;
    this.login = false;

    if (pagina == "/login") {
      if (this.checkSession()) {
        this.footer = true;
        this.router.navigate(["/home"]);
      } else {
        this.login = true;
        this.footer = false;
      }
    } else {
      if (!this.checkSession()) {
        this.footer = false;
        this.router.navigate(["/login"]);
      } else {
        if (pagina == "/changePasswd") {
          if (!this.checkChangePasswd()) {
            this.footer = true;
            this.router.navigate(["/home"]);
          } else {
            this.footer = false;
          }
        } else {
          if (this.checkChangePasswd()) {
            this.footer = false;
            this.router.navigate(["/changePasswd"]);
          } else {
            if (!this.admin) {
              this.checkRutaNotAdmin(pagina);
            }
            if (pagina.includes("/votar") || pagina.includes("/iniciarVotacion")) {
              this.footer = false;
            } else {
              this.footer = true;
            }
          }
        }
      }
    }
  }

  
}
