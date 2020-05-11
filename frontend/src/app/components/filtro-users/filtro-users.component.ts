import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

export interface FilterData {
  nombre;
  apellidos;
  cargo;
  departamentos;
}

@Component({
  selector: 'app-filtro-users',
  templateUrl: './filtro-users.component.html',
  styleUrls: ['./filtro-users.component.css']
})
export class FiltroUsersComponent implements OnInit {

  copyNombre = "";
  copyApellidos = "";
  copyCargo = "";
  copyDepartamentos = {};

  constructor(private _bottomSheetRef: MatBottomSheetRef<FiltroUsersComponent>, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: FilterData) {
      this.copyNombre = this.data.nombre.nombre;
      this.copyApellidos = this.data.apellidos.apellidos;
      this.copyCargo = this.data.cargo.cargo;
      for (var dpt of Object.keys(this.data.departamentos)) {
        this.copyDepartamentos[dpt] = this.data.departamentos[dpt];
      }
    }


  ngOnInit(): void {
  }

  filtrar() {
    this.data.nombre.nombre = this.copyNombre;
    this.data.apellidos.apellidos = this.copyApellidos;
    this.data.cargo.cargo = this.copyCargo;
    for (var dpt of Object.keys(this.copyDepartamentos)) {
      this.data.departamentos[dpt] = this.copyDepartamentos[dpt];
    }
    this._bottomSheetRef.dismiss();
  }

  limpiar() {
    this.data.nombre.nombre = "";
    this.data.apellidos.apellidos =  "";
    this.data.cargo.cargo =  "";
    for (var dpt of Object.keys(this.copyDepartamentos)) {
      this.data.departamentos[dpt] = false;
    }
    this._bottomSheetRef.dismiss();
  }

}
