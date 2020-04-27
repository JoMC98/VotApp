import { Component, OnInit, Input } from '@angular/core';
import { DatosVotacionControllerService } from 'src/app/services/sockets/datos-votacion-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  @Input() codigo;
  passwd = "";
  showPasswd = false;
  admin: boolean;

  constructor(private controllerVotacion: DatosVotacionControllerService, private sessionController: SessionControllerService) {
    this.admin = sessionController.getAdminSession();
  }

  ngOnInit(): void {
  }

  sendPasswd() {
    this.controllerVotacion.tryDecryptPrivateKey(this.passwd)
      .then(res => {
        this.passwd = "";
      })
      .catch(() => {
        setTimeout(() => {
          this.sendPasswd();
        }, 2000)
      })
  }

  showHidePasswd() {
    this.showPasswd = !this.showPasswd;
    if (this.showPasswd) {
      (<HTMLInputElement>document.getElementById("inputPasswd")).type = "text";
    } else {
      (<HTMLInputElement>document.getElementById("inputPasswd")).type = "password";
    }
  }
}
