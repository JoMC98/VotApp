import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginControlService } from 'src/app/services/authentication/login-control.service';
import { first } from 'rxjs/operators';

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

  constructor(private router: Router, private authenticationService: LoginControlService) { }

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

    this.authenticationService.login(this.dni, this.passwd).pipe(first()).subscribe(
        data => {
            this.router.navigate(["/home"]);
        },
        error => {
            // this.error = error;
            // this.loading = false;
        });


    // new Promise((res) => {
    //   setTimeout(() => {
    //     this.activarExplosion = true;
    //   }, 3000);
    // })
    // new Promise((res) => {
    //   setTimeout(() => {
    //     // this.router.navigate(['/home']);
    //     this.router.navigate(['/changePasswd']);
    //     res();
    //   }, 3800);
    // })
  }

}
