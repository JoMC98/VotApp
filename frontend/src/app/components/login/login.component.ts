import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginControllerService } from 'src/app/services/authentication/login-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

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

  constructor(private router: Router, private loginController: LoginControllerService, private sessionController: SessionControllerService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  openSnackBar() {
    var message = "Credenciales incorrectas"
    var action = "Cerrar"

    let config = new MatSnackBarConfig();
    config.duration = 5000;
    config.panelClass = ['error-snackbar']

    this._snackBar.open(message, action, config);
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
      this.activarBoton = true

      var credenciales = {dni : this.dni, passwd : this.passwd}

      this.loginController.login(credenciales)
      .then(() => {
        new Promise((res) => {
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
          new Promise((res) => {
            setTimeout(() => {
              this.activarBoton = false;
              this.openSnackBar()
              this.passwd = ""
            }, 2000);
          })
        } else {
          //MOSTRAR ERROR SERVIDOR
          console.log("MOSTRAR ERROR SERVIDOR")
        }
      })
    }
  }

  checkCredentials() {
    if (this.dni == "" || this.passwd == "") {
      this.openSnackBar()
      return false;
    } else {
      return true;
    }
  }

}
