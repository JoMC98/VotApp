import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DatosComponent } from './datos/datos.component';
import { OpcionesComponent } from './opciones/opciones.component';
import { ParticipantesComponent } from './participantes/participantes.component';
import { DescripcionComponent } from './descripcion/descripcion.component';
import { VotacionValidatorService } from 'src/app/services/validators/votacion/votacion-validator.service';


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

  @ViewChild(DatosComponent) datosReference;
  @ViewChild(DescripcionComponent) descripcionReference;
  @ViewChild(OpcionesComponent) opcionesReference;
  @ViewChild(ParticipantesComponent) participantesReference;

  constructor(private validator: VotacionValidatorService) {
    this.sect = [1];
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {}

  changeTo(opt) {
    this.checkSect().then(() => {
      this.sect[0] = opt
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
      this.data.datos.descripcion = this.descripcionReference.data.descripcion
    } else if (this.sect[0] == 3) {
      for (var i=0; i<this.opcionesReference.data.length; i++) {
        this.data.opciones[i] = this.opcionesReference.data[i]
      }
    } else if (this.sect[0] == 4) {
      for (var i=0; i<this.participantesReference.data.length; i++) {
        this.data.participantes[i] = this.participantesReference.data[i]
      }
    }
  }

  async checkDatos() {
    return await new Promise((resolve, reject) => {
      resolve(true)
      // this.validator.checkDatos(this.data.datos).then(() => {
      //   resolve(true)
      // }).catch(errors => {
      //   for (var k of Object.keys(errors)) {
      //     this.errors[k] = errors[k]
      //   }
      // })
    })
  }
}
