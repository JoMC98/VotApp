import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { LoginControllerService } from 'src/app/services/authentication/login-controller.service';

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

  constructor(private router: Router, private loginController: LoginControllerService) { }

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
    // this.activarBoton = true

    var credenciales = {dni : this.dni, passwd : this.passwd}

    this.loginController.login(credenciales)
      .then((result) =>{
        //TODO CHANGE PASSWORD REDIRECT?? AÑADIR A BD
        this.router.navigate(["/home"]);
      })
      .catch((error) => {
        console.log(error.error.status);
      })
    ;
  }

}
