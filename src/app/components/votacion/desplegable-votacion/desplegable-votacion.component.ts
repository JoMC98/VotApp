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
export class DesplegableVotacionComponent implements OnInit {

  departamentos = ["Administración","Dirección","Marketing","Finanzas"];
  ambitos = ["Pública","Privada","Departamento","Oculta"];
  objectKeys = Object.keys;
  addingUser: boolean = false;
  usuarios = {};
  users = {};

  constructor(private _bottomSheetRef: MatBottomSheetRef<DesplegableVotacionComponent>, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: DesplegableData) {
      this.users = {
        "12345678X": {dni:"12345678X", nombre: "Paco", apellido: "Gonzalez Lopez", departamento: "Administración", cargo:"Jefe de Abastecimiento",selected:false},
        "12345679X": {dni:"12345679X", nombre: "Mario", apellido: "Mir Dos", departamento: "Administración", cargo:"Jefe de Suministros",selected:false},
        "12345670X": {dni:"12345670X", nombre: "Luis", apellido: "Alvarez Lopez", departamento: "Dirección", cargo:"CEO",selected:false},
        "12345623X": {dni:"12345623X", nombre: "Ana", apellido: "Garcia Fernandez", departamento: "Marketing", cargo:"CMO",selected:false},
        "12345643A": {dni:"12345643A", nombre: "Juan", apellido: "De los palomos Garcia", departamento: "Finanzas", cargo:"Jefe de Ventas",selected:false},
        "12345612D": {dni:"12345612D", nombre: "Valentina", apellido: "Del arco Alarcon", departamento: "Dirección", cargo:"Jefe de Comerciales",selected:false},
        "13525678X": {dni:"13525678X", nombre: "Eustaquio", apellido: "Roca Zaragoza", departamento: "Administración", cargo:"CTO",selected:false},
        "85678678X": {dni:"85678678X", nombre: "Paco", apellido: "Lopez Torres", departamento: "Marketing", cargo:"CFO",selected:false},
        "96856678X": {dni:"96856678X", nombre: "Jordi", apellido: "Villa Parejo", departamento: "Marketing", cargo:"Secretario General",selected:false},
        "16456678X": {dni:"16456678X", nombre: "Manolo", apellido: "Betis Balompie", departamento: "Finanzas", cargo:"Asesor financiero",selected:false}};
  }

  ngOnInit(): void {

  }

  eliminarPresentes() {
    this.usuarios = {};
    for (let key of Object.keys(this.users)) {
      if (!(key in this.data.participantes)) {
        this.usuarios[key] = this.users[key];
      }
    }
  }

  selection(key) {
    var actual = this.usuarios[key].selected;
    this.usuarios[key].selected = !actual;
  }

  cancelar() {
    this._bottomSheetRef.dismiss();
  }

  guardar() {
    this._bottomSheetRef.dismiss();
  }

  deleteOption(key) {
    delete this.data.opciones[key]
  }

  deleteUser(key) {
    delete this.data.participantes[key]
  }

  addOption() {
    var op = "opcion" + (Object.keys(this.data.opciones).length + 1);
    this.data.opciones[op] = "";
  }

  addUser() {
    this.addingUser = true;
    this.eliminarPresentes();
  }

  confirmAddingUser() {
    this.addingUser = false;
    for (let key of Object.keys(this.usuarios)) {
      if (this.usuarios[key].selected) {
        var user = this.usuarios[key];
        var nuevo = {dni: user.dni, nombre: user.nombre, apellido: user.apellido, departamento: user.departamento, cargo: user.cargo}
        this.data.participantes[key] = nuevo;
      }
    }
  }

  cancelAddingUser() {
    this.addingUser = false;
  }

}
