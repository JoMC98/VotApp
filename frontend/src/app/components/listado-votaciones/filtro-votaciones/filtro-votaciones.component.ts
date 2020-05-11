import { FilterData } from './../listado-votaciones.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-filtro-votaciones',
  templateUrl: './filtro-votaciones.component.html',
  styleUrls: ['./filtro-votaciones.component.css']
})
export class FiltroVotacionesComponent implements OnInit {

  copyPregunta = "";
  copyAmbitos = {};
  copyEstados = {};
  copyDepartamentos = {};

  constructor(private _bottomSheetRef: MatBottomSheetRef<FiltroVotacionesComponent>, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: FilterData) {
      this.copyPregunta = this.data.pregunta.pregunta;
      for (var st of Object.keys(this.data.estados)) {
        this.copyEstados[st] = this.data.estados[st];
      }
      for (var amb of Object.keys(this.data.ambitos)) {
        this.copyAmbitos[amb] = this.data.ambitos[amb];
      }
      for (var dpt of Object.keys(this.data.departamentos)) {
        this.copyDepartamentos[dpt] = this.data.departamentos[dpt];
      }
  }


  ngOnInit(): void {
  }

  filtrar() {
    this.data.pregunta.pregunta = this.copyPregunta;
    for (var st of Object.keys(this.copyEstados)) {
      this.data.estados[st] = this.copyEstados[st];
    }
    for (var amb of Object.keys(this.copyAmbitos)) {
      this.data.ambitos[amb] = this.copyAmbitos[amb];
    }
    for (var dpt of Object.keys(this.copyDepartamentos)) {
      this.data.departamentos[dpt] = this.copyDepartamentos[dpt];
    }
    this._bottomSheetRef.dismiss();
  }

  limpiar() {
    this.data.pregunta.pregunta = "";
    for (var st of Object.keys(this.copyEstados)) {
      this.data.estados[st] = false;
    }
    for (var amb of Object.keys(this.copyAmbitos)) {
      this.data.ambitos[amb] = false;
    }
    for (var dpt of Object.keys(this.copyDepartamentos)) {
      this.data.departamentos[dpt] = false;
    }
    this._bottomSheetRef.dismiss();
  }
}
