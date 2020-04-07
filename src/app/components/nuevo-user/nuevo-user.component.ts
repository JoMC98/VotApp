import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';
import { DatosContactoComponent } from './datos-contacto/datos-contacto.component';

@Component({
  selector: 'app-nuevo-user',
  templateUrl: './nuevo-user.component.html',
  styleUrls: ['./nuevo-user.component.css']
})
export class NuevoUserComponent implements OnInit {
  sect = [];
  points: number[] = [1,2,3];

  data = {personalData: {nombre: "", apellidos: "", DNI: "", passwd: ""}, contactData: {telefono: "", mail: "", departamento: "", cargo: ""}};

  @ViewChild(DatosPersonalesComponent) datosPersonalesReference;
  @ViewChild(DatosContactoComponent) datosContactoReference;

  constructor() {
    this.sect = [1];
  }

  ngOnInit(): void {
  }

  cambioPag(ind) {
    if (this.sect[0] == 1) {
      for (var k of Object.keys(this.data.personalData)) {
        this.data.personalData[k] = this.datosPersonalesReference.data[k]
      }
    } else if (this.sect[0] == 2) {
      for (var k of Object.keys(this.data.contactData)) {
        this.data.contactData[k] = this.datosContactoReference.data[k]
      }
    }
    if (ind == 1) {
      this.sect[0] = ((this.sect[0] - 1) == 0 ? 1 : this.sect[0] - 1);
    } else {
      this.sect[0] = ((this.sect[0] + 1) == 4 ? 3 : this.sect[0] + 1);
    }
  }
}
