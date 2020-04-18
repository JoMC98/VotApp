import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { fromEvent } from "rxjs";
import {takeWhile} from "rxjs/operators"
import { DatosComponent } from './datos/datos.component';
import { OpcionesComponent } from './opciones/opciones.component';
import { ParticipantesComponent } from './participantes/participantes.component';


@Component({
  selector: 'app-nueva-votacion',
  templateUrl: './nueva-votacion.component.html',
  styleUrls: ['./nueva-votacion.component.css']
})
export class NuevaVotacionComponent implements OnInit, OnDestroy {
  sect = [];
  points: number[] = [1,2,3,4];

  data = {datos: {pregunta: "", departamento: "", f_votacion: "", ambito: "", descripcion: ""}, opciones: ["", ""], participantes: []};

  @ViewChild(DatosComponent) datosReference;
  @ViewChild(OpcionesComponent) opcionesReference;
  @ViewChild(ParticipantesComponent) participantesReference;

  constructor() {
    this.sect = [1];
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {}

  cambioPag(ind) {
    if (this.sect[0] == 1) {
      for (var k of Object.keys(this.data.datos)) {
        this.data.datos[k] = this.datosReference.data[k]
      }
    } else if (this.sect[0] == 2) {
      for (var i=0; i<this.opcionesReference.data.length; i++) {
        this.data.opciones[i] = this.opcionesReference.data[i]
      }
    } else if (this.sect[0] == 3) {
      for (var i=0; i<this.participantesReference.data.length; i++) {
        this.data.participantes[i] = this.participantesReference.data[i]
      }
    }

    if (ind == 1) {
      this.sect[0] = ((this.sect[0] - 1) == 0 ? 1 : this.sect[0] - 1);
    } else {
      this.sect[0] = ((this.sect[0] + 1) == 5 ? 4 : this.sect[0] + 1);
    }
  }

}
