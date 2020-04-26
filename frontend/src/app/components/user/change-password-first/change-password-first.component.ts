import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginControllerService } from 'src/app/services/authentication/login-controller.service';
import { KeyPasswordControllerService } from 'src/app/services/cipher/key-password-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';

@Component({
  selector: 'app-change-password-first',
  templateUrl: './change-password-first.component.html',
  styleUrls: ['./change-password-first.component.css']
})
export class ChangePasswordFirstComponent implements OnInit {

  showPasswd1: boolean = false;
  showPasswd2: boolean = false;
  changed: boolean = false;
  newPasswd: string = "";
  repPasswd: string = "";

  constructor(private router: Router, private loginController: LoginControllerService, 
    private kewPasswordController: KeyPasswordControllerService, private sessionController: SessionControllerService,
    private controllerBD: DatabaseControllerService) { }

  ngOnInit(): void {
  }

  logout() {
    this.loginController.logout();
  }

  showHidePasswd(id) {
    var aux = null;
    if (id == 1) {
      this.showPasswd1 = !this.showPasswd1;
      aux = this.showPasswd1;
    } else {
      this.showPasswd2 = !this.showPasswd2;
      aux = this.showPasswd2;
    }
    
    if (aux) {
      (<HTMLInputElement>document.getElementById("inputPasswd" + id)).type = "text";
    } else {
      (<HTMLInputElement>document.getElementById("inputPasswd" + id)).type = "password";
    }
  }

  change() {
    if (this.newPasswd != "" && this.repPasswd != "" && this.newPasswd == this.repPasswd) {
     
      this.kewPasswordController.generateAndEncryptKeyPair(this.newPasswd).then(claves => {
        var dni = this.sessionController.getDNISession()
        var body = {password: this.newPasswd, DNI: dni, clavePublica: claves["clavePublica"], clavePrivada: claves["clavePrivada"]}

        this.controllerBD.modificarContraseñaFirst(body).then(result => {
          this.changed = true;
          this.sessionController.updateChangePasswdSession();
          new Promise((res) => {
            setTimeout(() => {
              this.router.navigate(['/home']);
              res();
            }, 2500);
          })
        }).catch(err => {
          console.log(false)
          //ERROR
        })
      })
      
    } else {
      console.log(false)
      //ERROR
    }
    

    
  }

}
