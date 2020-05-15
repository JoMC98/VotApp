import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {
  showPasswd: boolean = false;

  @Input() data;
  @Input() errors;

  errorTypes = {nombre: {required: "Este campo es obligatorio", badFormed: "Este campo no puede contener números"}, 
                apellidos: {required: "Este campo es obligatorio", badFormed: "Este campo no puede contener números"},
                DNI: {required: "Este campo es obligatorio", badFormed: "Este campo debe seguir el formato de un DNI (8 números y 1 letra)", length: "Este campo debe tener 9 carácteres", duplicated: "Este DNI ya está en uso"},
                passwd: {required: "Este campo es obligatorio", badFormed: "Este campo debe contener letras y números", length: "Este campo debe contener al menos 8 carácteres"}}

  constructor() { 
  }

  ngOnInit(): void {
  }

  showHidePasswd() {
    this.showPasswd = !this.showPasswd;
    if (this.showPasswd) {
      (<HTMLInputElement>document.getElementById("inputPasswd")).classList.remove('notShowPasswd')
    } else {
      (<HTMLInputElement>document.getElementById("inputPasswd")).classList.add('notShowPasswd')
    }
  }

  removeError(att) {
    delete this.errors[att];
  }

}
