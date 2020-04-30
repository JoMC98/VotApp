import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';

export interface DesplegableData {
  page;
  votacion;
  copyOpciones;
  copyParticipantes;
}

@Component({
  selector: 'app-desplegable-votacion',
  templateUrl: './desplegable-votacion.component.html',
  styleUrls: ['./desplegable-votacion.component.css']
})
export class DesplegableVotacionComponent implements OnInit {

  ambitos = ["Pública","Privada","Departamento","Oculta"];
  departamentos = [];
  listaDepartamentos = {};
  objectKeys = Object.keys;
  addingUser: boolean = false;

  usuarios = [];
  users = {};
  selected = [];
  boolSelected = {};

  copyDescripcion = "";
  copyAmbito = "";
  copyDepartamento = "";
  copyFecha = null;

  opciones = []
  participantes = []

  constructor(private _bottomSheetRef: MatBottomSheetRef<DesplegableVotacionComponent>, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: DesplegableData, private controllerBD: DatabaseControllerService, private listDepartamentos: ListaDepartamentosService) {
      this.departamentos = this.listDepartamentos.getDepartamentosOnlyName();
      this.listaDepartamentos = this.listDepartamentos.getDepartamentos();

      switch (this.data.page) {
        case "descripcion":
        case "editarDescripcion":
        case "editarAmbito":
        case "editarFecha":
        case "editarDepartamento":
          this.copyDescripcion = this.data.votacion.descripcion
          this.copyAmbito = this.data.votacion.ambito
          this.copyDepartamento = this.data.votacion.departamento
          this.copyFecha = this.data.votacion.f_votacion
          break;
        case "opciones":
        case "editarOpciones":
          this.opciones = [];
          for (var opt in this.data.copyOpciones) {
            this.opciones[opt] = this.data.copyOpciones[opt];
          }
        
          break;
        case "participantes":
          this.participantes = [];
          for (var part in this.data.copyParticipantes) {
            this.participantes[part] = this.data.copyParticipantes[part];
          }
          break;
        case "editarParticipantes":
          this.participantes = [];
          for (var part in this.data.copyParticipantes) {
            this.participantes[part] = this.data.copyParticipantes[part];
          }
          this.obtenerUsuarios();
          break;
      }
  }

  ngOnInit(): void {

  }

  cancelar() {
    this._bottomSheetRef.dismiss();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  guardar() {
    switch (this.data.page) {
      case "editarDescripcion":
      case "editarAmbito":
      case "editarDepartamento":
      case "editarFecha":
        this.data.votacion.descripcion = this.copyDescripcion
        this.data.votacion.ambito = this.copyAmbito
        this.data.votacion.f_votacion = this.copyFecha
        this.data.votacion.departamento = this.copyDepartamento

        this.controllerBD.modificarVotacion(this.data.votacion).then((result) => {
          console.log(result);
        }).catch(err => {
          //TODO ERRORES 
          console.log(err);
        });
        break;
      case "editarOpciones":
        var datos = {codigo: this.data.votacion.codigo, opciones: this.opciones}
        this.controllerBD.modificarOpcionesVotacion(datos).then((result) => {
          console.log(result);
        }).catch(err => {
          //TODO ERRORES 
          console.log(err);
        });
        break;
      case "editarParticipantes":
        var p = []
        for (var part of this.participantes) {
          p.push(part.dni)
        }
        var data = {codigo: this.data.votacion.codigo, participantes: p}
        this.controllerBD.modificarParticipantesVotacion(data).then((result) => {
          console.log(result);
        }).catch(err => {
          //TODO ERRORES 
          console.log(err);
        });
        break;
    }
    this._bottomSheetRef.dismiss();
  }

  deleteOption(i) {
    this.opciones.splice(i, 1);
  }

  addOption() {
    this.opciones.push("");
  }

  //Método para borrar usuario

  deleteUser(id) {
    this.participantes.splice(id, 1);
    this.obtenerUsuarios();
  }

  //Métodos para añadir nuevos usuarios

  obtenerUsuarios() {
    var res = []
    for (var us of this.participantes) {
      res.push(us.dni)
    }
    var body = {participantes: res}
    this.usuarios = []
    this.boolSelected = {}
    this.controllerBD.obtenerUsuariosFueraVotacion(body).then((result) => {
      for (let i of Object.keys(result)) {
        this.usuarios.push(result[i])
        this.boolSelected[result[i].dni] = false;
      }
      this.generarListado(this.usuarios);
    });
  }

  addUser() {
    this.addingUser = true;
  }

  generarListado(listado) {
    this.users = {};
    for (let user of listado) {
      var inicial = user.nombre.charAt(0);
      if (this.users[inicial]) {
        this.users[inicial].push(user);
      } else {
        this.users[inicial] = [user];
      }
    }
  }

  confirmAddingUser() {
    this.addingUser = false;
    for (var us of this.selected) {
      this.participantes.push(us);
    }
    this.selected = []
    this.obtenerUsuarios();
  }

  cancelAddingUser() {
    this.addingUser = false;
  }

  selection(user) {
    if (this.isSelected(user)) {
      this.selected.splice(this.selected.indexOf(user), 1)
    } else {
      this.selected.push(user)
    }
  }

  isSelected(user) {
    if (this.selected.includes(user)) {
      return true;
    }
    return false;
  }
}
