import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { LoginControllerService } from 'src/app/services/authentication/login-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';

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

  constructor(private router: Router, private loginController: LoginControllerService, private sessionController: SessionControllerService) { }

  ngOnInit(): void {
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
    this.activarBoton = true

    var credenciales = {dni : this.dni, passwd : this.passwd}

    this.loginController.login(credenciales)
      .then(() => {
        //TODO CHANGE PASSWORD REDIRECT?? AÑADIR A BD
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
        new Promise((res) => {
          setTimeout(() => {
            this.activarBoton = false;
          }, 2000);
        })
        if (wrongCredentials) {
          //MOSTRAR ERROR CREDENCIALES
          console.log("MOSTRAR ERROR CREDENCIALES")
        } else {
          //MOSTRAR ERROR SERVIDOR
          console.log("MOSTRAR ERROR SERVIDOR")
        }
      })
    ;
  }

}
