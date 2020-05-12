import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';
import { DatosContactoComponent } from './datos-contacto/datos-contacto.component';
import { ResumenUserComponent } from './resumen-user/resumen-user.component';
import { UserValidatorService } from 'src/app/services/validators/user/user-validator.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nuevo-user',
  templateUrl: './nuevo-user.component.html',
  styleUrls: ['./nuevo-user.component.css']
})
export class NuevoUserComponent implements OnInit {
  sect = [];
  points: number[] = [1,2,3];

  data = {personalData: {nombre: "", apellidos: "", DNI: "", passwd: ""}, contactData: {telefono: "", mail: "", departamento: "", cargo: ""}};
  errors = {}

  @ViewChild(DatosPersonalesComponent) datosPersonalesReference;
  @ViewChild(DatosContactoComponent) datosContactoReference;
  @ViewChild(ResumenUserComponent) resumenReference;

  constructor(private validator: UserValidatorService) {
    this.sect = [1];
  }

  ngOnInit(): void {
  }

  cambioPag(ind) {
    this.checkSect().then(() => {
      if (ind == 1) {
        this.sect[0] = ((this.sect[0] - 1) == 0 ? 1 : this.sect[0] - 1);
      } else {
        this.sect[0] = ((this.sect[0] + 1) == 4 ? 3 : this.sect[0] + 1);
      }
    })
  }

  changeTo(opt) {
    this.checkSect().then(() => {
      if (opt == 3) {
        if (this.data.contactData.cargo != "") {
          this.sect[0] = opt
        }
      } else {
        this.sect[0] = opt
      }
    })
  }

  capitalizeFirstLetter(str) {
    var words = str.split(" ")
    var wordsCap = []
    for (var w of words) {
      wordsCap.push(w.charAt(0).toUpperCase() + w.slice(1))
    }
    return wordsCap.join(' ')
  }

  async checkSect() {
    if (this.sect[0] == 1) {
      for (var k of Object.keys(this.data.personalData)) {
        if (k == "nombre" || k == "apellidos") {
          this.data.personalData[k] = this.capitalizeFirstLetter(this.datosPersonalesReference.data[k])
        } else {
          this.data.personalData[k] = this.datosPersonalesReference.data[k]
        }
      }
      return this.checkPersonalData()
    } else if (this.sect[0] == 2) {
      for (var k of Object.keys(this.data.contactData)) {
        if (k == "cargo") {
          this.data.contactData[k] = this.capitalizeFirstLetter(this.datosContactoReference.data[k])
        } else {
          this.data.contactData[k] = this.datosContactoReference.data[k]
        }
      }
      return this.checkContactData()
    } else {
      for (var k of Object.keys(this.resumenReference.errors)) {
        this.errors[k] = this.resumenReference.errors[k]
      }
    }
  }

  async checkPersonalData() {
    return await new Promise((resolve, reject) => {
      this.validator.checkPersonal(this.data.personalData).then(() => {
        if (!this.errors["DNI"]) {
          resolve(true)
        }
      }).catch(errors => {
        for (var k of Object.keys(errors)) {
          this.errors[k] = errors[k]
        }
      })
    })
  }

  async checkContactData() {
    return await new Promise((resolve, reject) => {
      this.validator.checkContact(this.data.contactData).then(() => {
        if (!this.errors["mail"]) {
          resolve(true)
        }
      }).catch(errors => {
        for (var k of Object.keys(errors)) {
          this.errors[k] = errors[k]
        }
      })
    })
  }
}
