import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

export interface DesplegableData {
  page;
  descripcion;
  opciones;
  participantes;
  ambito;
  departamento;
}

@Component({
  selector: 'app-desplegable-votacion',
  templateUrl: './desplegable-votacion.component.html',
  styleUrls: ['./desplegable-votacion.component.css']
})
export class DesplegableVotacionComponent implements OnInit, AfterViewInit {

  departamentos = ["Administración","Dirección","Marketing","Finanzas"];
  ambitos = ["Pública","Privada","Departamento","Oculta"];

  constructor(private _bottomSheetRef: MatBottomSheetRef<DesplegableVotacionComponent>, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: DesplegableData) {
      
    }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  //   if (this.data.page == "editarDescripcion") {
  //     var textarea = document.getElementById("textareaModifyDescriptionVotacion");
  //     var altura = document.getElementById("labelModifyDescriptionVotacion").clientHeight + "px";
  //     textarea.style.height = altura;
  //   }
  }

  cancelar() {
    this._bottomSheetRef.dismiss();
  }

  guardar() {
    this._bottomSheetRef.dismiss();
  }

  deleteOption(i) {
    this.data.opciones.splice(i, 1);
  }

  addOption() {
    this.data.opciones.push("");
    var el = "opcionDialogoDesplegable" + (this.data.opciones.length - 1);
    document.getElementById(el).focus();
  }

}
