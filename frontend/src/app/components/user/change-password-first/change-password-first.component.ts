import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginControllerService } from 'src/app/services/authentication/login-controller.service';
import { KeyPasswordControllerService } from 'src/app/services/cipher/key-password-controller.service';

@Component({
  selector: 'app-change-password-first',
  templateUrl: './change-password-first.component.html',
  styleUrls: ['./change-password-first.component.css']
})
export class ChangePasswordFirstComponent implements OnInit {

  showPasswd1: boolean = false;
  showPasswd2: boolean = false;
  changed: boolean = false;

  constructor(private router: Router, private loginController: LoginControllerService, 
    private kewPasswordController: KeyPasswordControllerService) { }

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
    this.changed = true;

    this.kewPasswordController.generateAndEncryptKeyPair("patata")

    // new Promise((res) => {
    //   setTimeout(() => {
    //     this.router.navigate(['/home']);
    //     res();
    //   }, 2500);
    // })
  }

}
