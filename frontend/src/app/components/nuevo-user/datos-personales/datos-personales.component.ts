import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {
  showPasswd: boolean = false;

  @Input() data;

  constructor() { 
  }

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

}