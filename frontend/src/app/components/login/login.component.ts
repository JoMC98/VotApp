import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginControllerService } from 'src/app/services/authentication/login-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { error } from 'protractor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  activarBoton: boolean = false;
  activarExplosion: boolean = false;
  showPasswd: boolean = false;

  dni: string = "";
  passwd: string = "";

  errorLogin= false;
  errorServer= false;

  constructor(private router: Router, private loginController: LoginControllerService, private sessionController: SessionControllerService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  borrarError() {
    this.errorLogin = false;
    this.errorServer = false;
  }

  showHidePasswd() {
    this.showPasswd = !this.showPasswd;
    if (this.showPasswd) {
      (<HTMLInputElement>document.getElementById("inputPasswd")).type = "text";
    } else {
      (<HTMLInputElement>document.getElementById("inputPasswd")).type = "password";
    }
  }

  rutar() {
    if(this.checkCredentials()) {
      var credenciales = {dni : this.dni, passwd : this.passwd}

      this.loginController.login(credenciales)
      .then(() => {
        new Promise((res) => {
          this.activarBoton = true
          setTimeout(() => {
            this.activarExplosion = true;
          }, 2000);
        })
        new Promise((res) => {
          setTimeout(() => {
            var changePasswd = this.sessionController.getChangePasswdSession()
            if (changePasswd) {
              this.router.navigate(['/changePasswd']);
            } else {
              this.router.navigate(['/home']);
            }
            res();
          }, 2800);
        })
      })
      .catch((wrongCredentials) => {
        if (wrongCredentials) {
          this.passwd = ""
          this.showError()
        } else {
          this.passwd = ""
          this.showErrorServer()
        }
      })
    }
  }

  checkCredentials() {
    if (this.dni == "" || this.passwd == "") {
      this.showError()
      return false;
    } else {
      return true;
    }
  }

  showError() {
    this.errorLogin = true;
    (<HTMLDivElement>document.getElementById("botonLogin")).classList.add("shake-little")
    setTimeout(() => {
      (<HTMLDivElement>document.getElementById("botonLogin")).classList.remove("shake-little")
    }, 500);
  }

  showErrorServer() {
    this.errorServer = true;
    (<HTMLDivElement>document.getElementById("botonLogin")).classList.add("shake-little")
    setTimeout(() => {
      (<HTMLDivElement>document.getElementById("botonLogin")).classList.remove("shake-little")
    }, 500);
  }

}
