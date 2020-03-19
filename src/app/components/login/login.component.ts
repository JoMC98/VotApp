import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  activarBoton: boolean = false;
  activarExplosion: boolean = false;
  showPasswd: boolean = false;

  constructor(private router: Router) { }

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
    new Promise((res) => {
      setTimeout(() => {
        this.activarExplosion = true;
      }, 3000);
    })
    new Promise((res) => {
      setTimeout(() => {
        // this.router.navigate(['/home']);
        this.router.navigate(['/changePasswd']);
        res();
      }, 3800);
    })
  }

}
