import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginControllerService } from 'src/app/services/authentication/login-controller.service';
import { KeyPasswordControllerService } from 'src/app/services/cipher/key-password-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { UserValidatorService } from 'src/app/services/validators/user/user-validator.service';
import { PasswordValidatorService } from 'src/app/services/validators/user/password-validator.service';

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

  errors = {}

  errorTypes = {nueva: {required: "Este campo es obligatorio",  badFormed: "La nueva contraseña debe contener letras y números", length: "La nueva contraseña debe contener al menos 8 carácteres"}, 
                repetir: {required: "Este campo es obligatorio", notSame: "Las contraseñas no coinciden"}}

  constructor(private router: Router, private loginController: LoginControllerService, 
    private kewPasswordController: KeyPasswordControllerService, private sessionController: SessionControllerService,
    private controllerBD: DatabaseControllerService, private passwdValidator: PasswordValidatorService) { }

  ngOnInit(): void {
  }

  logout() {
    this.loginController.logout();
  }

  removeError(att) {
    delete this.errors[att];
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
      (<HTMLInputElement>document.getElementById("inputPasswd" + id)).classList.remove('notShowPasswd')
    } else {
      (<HTMLInputElement>document.getElementById("inputPasswd" + id)).classList.add('notShowPasswd')
    }
  }

  change() {
    this.errors = {}
    var errors = this.passwdValidator.checkNewPassword(null, this.newPasswd, this.repPasswd)
    if (errors == true) {
      this.kewPasswordController.generateAndEncryptKeyPair(this.newPasswd).then(claves => {
        var dni = this.sessionController.getDNISession()
        var body = {nueva: this.newPasswd, DNI: dni, clavePublica: claves["clavePublica"], clavePrivada: claves["clavePrivada"]}

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
          console.log(err);
        });
      })
    } else {
      if (errors["nueva"]) {
        this.errors["nueva"] = errors["nueva"]
      }
      if (errors["repetir"]) {
        this.errors["repetir"] = errors["repetir"]
      }
    }
  }
}
