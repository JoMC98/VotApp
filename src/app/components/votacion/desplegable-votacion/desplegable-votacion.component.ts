import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

export interface DesplegableData {
  page;
  descripcion;
  opciones;
  participantes;
  ambito;
  departamento;
  fecha;
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
  users = {
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
  usuariosIniciales = {};

  copyDescripcion = "";
  copyOpciones = [];
  copyParticipantes = {};
  copyAmbito = "";
  copyDepartamento = "";
  copyFecha = null;

  constructor(private _bottomSheetRef: MatBottomSheetRef<DesplegableVotacionComponent>, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: DesplegableData) {
      switch (this.data.page) {
        case "descripcion":
        case "editarDescripcion":
          this.copyDescripcion = this.data.descripcion.descripcion
          break;
        case "opciones":
        case "editarOpciones":
        case "resultados":
          for (var el in this.data.opciones) {
            this.copyOpciones[el] = this.data.opciones[el];
          }
          break;
        case "participantes":
        case "editarParticipantes":
          for (var dni of Object.keys(this.data.participantes)) {
            this.copyParticipantes[dni] = {};
            for (var elem of Object.keys(this.data.participantes[dni])) {
              this.copyParticipantes[dni][elem] = this.data.participantes[dni][elem];
            }
          }
          break;
        case "editarAmbito":
          this.copyAmbito = this.data.ambito.ambito
          break;
        case "editarDepartamento":
          this.copyDepartamento = this.data.departamento.departamento
          break;
        case "editarFecha":
          this.copyFecha = this.data.fecha.fecha
          break;
      }
  }

  ngOnInit(): void {

  }

  cancelar() {
    this._bottomSheetRef.dismiss();
  }

  guardar() {
    switch (this.data.page) {
      case "editarDescripcion":
        this.data.descripcion.descripcion = this.copyDescripcion
        break;
      case "editarOpciones":
        var totCopy = this.copyOpciones.length;
        var totData = this.data.opciones.length;
        for (var el in this.copyOpciones) {
          var valor = (<HTMLTextAreaElement>document.getElementById("inputOpcionDialogoDesplegableModify" + el)).value;
          this.data.opciones[el] = valor;
        }
        for (var i = totCopy; i < totData; i++) {
          delete this.data.opciones[i];
        }
        break;
      case "editarParticipantes":
        for (var dni of Object.keys(this.data.participantes)) {
          if (! (dni in this.copyParticipantes)) {
            delete this.data.participantes[dni];
          }
        }
        for (var dni of Object.keys(this.copyParticipantes)) {
          if (! (dni in this.data.participantes)) {
            this.data.participantes[dni] = this.copyParticipantes[dni];
          }
        }
        console.log(this.data.participantes)

        break;
      case "editarAmbito":
        this.data.ambito.ambito = this.copyAmbito
        break;
      case "editarDepartamento":
        this.data.departamento.departamento = this.copyDepartamento
        break;
      case "editarFecha":
        this.data.fecha.fecha = this.copyFecha
    }
    this._bottomSheetRef.dismiss();
  }

  //Métodos para gestion de las opciones

  deleteOption(i) {
    this.copyOpciones.splice(i, 1);
  }

  addOption() {
    this.copyOpciones.push("");
  }

  //Método para borrar usuario

  deleteUser(key) {
    delete this.copyParticipantes[key]
  }

  //Métodos para añadir nuevos usuarios

  confirmAddingUser() {
    this.addingUser = false;
    for (let key of Object.keys(this.usuarios)) {
      if (this.usuarios[key].selected) {
        var user = this.usuarios[key];
        var nuevo = {dni: user.dni, nombre: user.nombre, apellido: user.apellido, departamento: user.departamento, cargo: user.cargo}
        this.copyParticipantes[key] = nuevo;
      }
    }
  }

  cancelAddingUser() {
    this.addingUser = false;
  }

  addUser() {
    this.addingUser = true;
    this.eliminarPresentes();
    this.agruparPorIniciales();
  }

  selection(inicialKey, userKey) {
    console.log(inicialKey + " " + userKey)
    var actual = this.usuariosIniciales[inicialKey][userKey].selected;
    this.usuariosIniciales[inicialKey][userKey].selected = !actual;
  }

  //Métodos para los listados al añadir usuarios

  eliminarPresentes() {
    this.usuarios = {};
    for (let key of Object.keys(this.users)) {
      if (!(key in this.copyParticipantes)) {
        this.usuarios[key] = this.users[key];
      }
    }
  }

  agruparPorIniciales() {
    this.usuariosIniciales = {};
    for (let key of Object.keys(this.usuarios)) {
      var name = this.usuarios[key].nombre;
      var dni = this.usuarios[key].dni;
      var inicial = name.charAt(0);
      if (this.usuariosIniciales[inicial]) {
        this.usuariosIniciales[inicial][key] = this.usuarios[key];
      } else {
        this.usuariosIniciales[inicial] = {};
        this.usuariosIniciales[inicial][key] = this.usuarios[key];
      }
    }
  }

}
