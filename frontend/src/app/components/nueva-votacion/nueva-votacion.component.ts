import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DatosComponent } from './datos/datos.component';
import { OpcionesComponent } from './opciones/opciones.component';
import { ParticipantesComponent } from './participantes/participantes.component';
import { DescripcionComponent } from './descripcion/descripcion.component';
import { VotacionValidatorService } from 'src/app/services/validators/votacion/votacion-validator.service';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-nueva-votacion',
  templateUrl: './nueva-votacion.component.html',
  styleUrls: ['./nueva-votacion.component.css']
})
export class NuevaVotacionComponent implements OnInit, OnDestroy {
  sect = [];
  points: number[] = [1,2,3,4,5];

  data = {datos: {pregunta: "", departamento: "", f_votacion: "", ambito: "", descripcion: ""}, opciones: ["", ""], participantes: []};
  errors = {}

  errorTypes = {options: {required: "Debes introducir al menos dos opciones", duplicated: "No se pueden repetir opciones"}}

  @ViewChild(DatosComponent) datosReference;
  @ViewChild(DescripcionComponent) descripcionReference;
  @ViewChild(OpcionesComponent) opcionesReference;
  @ViewChild(ParticipantesComponent) participantesReference;

  constructor(private validator: VotacionValidatorService, private _snackBar: MatSnackBar) {
    this.sect = [1];
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {}

  changeTo(opt) {
    this.checkSect().then(() => {
      if (opt == 4) {
        if (this.data.opciones[0] != "") {
          this.sect[0] = opt
        }
      } else if (opt == 5) {
        if (this.data.participantes.length > 0) {
          this.sect[0] = opt
        }
      } else {
        this.sect[0] = opt
      }
    })
  }

  cambioPag(ind) {
    this.checkSect().then(() => {
      if (ind == 1) {
        this.sect[0] = ((this.sect[0] - 1) == 0 ? 1 : this.sect[0] - 1);
      } else {
        this.sect[0] = ((this.sect[0] + 1) == 6 ? 5 : this.sect[0] + 1);
      }
    })
  }

  capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  capitalizePregunta(str) {
    if (str.length == 0) {
      return str 
    } else {
      var first = str.charAt(0)
      var last = str.charAt(str.length - 1)
      if (first != "¿") {
        str = "¿" + str
      }
      if (last != "?") {
        str = str + "?"
      }
      str = "¿" + str.charAt(1).toUpperCase() + str.slice(2)
      return str
    }
  }

  async checkSect() {
    if (this.sect[0] == 1) {
      for (var k of Object.keys(this.data.datos)) {
        if (k != "descripcion") {
          if (k == "pregunta") {
            this.data.datos[k] = this.capitalizePregunta(this.datosReference.data[k])
          } else {
            this.data.datos[k] = this.datosReference.data[k]
          }
        }
      }
      return this.checkDatos()
    } else if (this.sect[0] == 2) {
      this.data.datos.descripcion = this.capitalizeString(this.descripcionReference.data.descripcion)
    } else if (this.sect[0] == 3) {
      for (var i=0; i<this.opcionesReference.data.length; i++) {
        this.data.opciones[i] = this.capitalizeString(this.opcionesReference.data[i])
      }
      return this.checkOptions()
    } else if (this.sect[0] == 4) {
      for (var i=0; i<this.participantesReference.data.length; i++) {
        this.data.participantes[i] = this.participantesReference.data[i]
      }
      return this.checkParticipants()
    }
  }

  async checkDatos() {
    return await new Promise((resolve, reject) => {
      this.validator.checkDatos(this.data.datos).then(() => {
        resolve(true)
      }).catch(errors => {
        for (var k of Object.keys(errors)) {
          this.errors[k] = errors[k]
        }
      })
    })
  }

  async checkOptions() {
    delete this.errors["options"]
    return await new Promise((resolve, reject) => {
      this.validator.checkOptions(this.data.opciones).then((opt) => {
        this.changeOptions(opt)
        resolve(true)
      }).catch((res) => {
        var errors = res[0]
        var opt = res[1]
        this.errors["options"] = errors["options"]
        this.changeOptions(opt)
      })
    })
  }

  async checkParticipants() {
    return await new Promise((resolve, reject) => {

      this.validator.checkParticipants(this.data.participantes).then(() => {
        resolve(true)
      }).catch(() => {
        this.openParticipantsError()
      })
    })
  }

  openParticipantsError() {
    var message = "Se deben seleccionar al menos 3 participantes."
    var action = "Cerrar"

    let config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = ['error-snackbar']

    this._snackBar.open(message, action, config);
  }


  changeOptions(opt) {
    this.data.opciones = []
    for (var k of Object.keys(opt)) {
      this.data.opciones[k] = opt[k]
    }
  }
}
