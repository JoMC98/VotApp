import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  variable: boolean = false;
  vari: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  metodo() {
    this.variable = true;
    setTimeout(function() {
      this.vari = true;
    }, 500);
  }

}
