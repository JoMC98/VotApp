import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import { VotacionValidatorService } from 'src/app/services/validators/votacion/votacion-validator.service';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

class PickDateAdapter extends MomentDateAdapter {
  format(date: any): string {
    var d = formatDate(date, 'EEEE, d' + "' de '" + 'MMMM', this.locale)
    var words = d.split(" ")
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    words[3] = words[3].charAt(0).toUpperCase() + words[3].slice(1)
    
    d = words.join(' ')
    return d;
  }
}


export interface DesplegableData {
  page;
  votacion;
  copyOpciones;
  copyParticipantes;
}

@Component({
  selector: 'app-desplegable-votacion',
  templateUrl: './desplegable-votacion.component.html',
  styleUrls: ['./desplegable-votacion.component.css'],
  providers: [
    {
      provide: DateAdapter, 
      useClass: PickDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
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

  errorFecha = false;
  errors = {}
  errorOptions = [false, false]
  errorTypes = {options: {required: "Debes introducir al menos dos opciones", duplicated: "No se pueden repetir opciones", requiredAlert: "Debes introducir al menos dos opciones"}}

  opciones = []
  participantes = []

  freeParticipants = 0;
  disabled = false;

  minDate: Date;
  myFilter;

  constructor(private _bottomSheetRef: MatBottomSheetRef<DesplegableVotacionComponent>, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: DesplegableData, private controllerBD: DatabaseControllerService, 
    private listDepartamentos: ListaDepartamentosService, private adapter: DateAdapter<any>, private validator: VotacionValidatorService, private _snackBar: MatSnackBar) {
      this.departamentos = this.listDepartamentos.getDepartamentosOnlyName();
      this.listaDepartamentos = this.listDepartamentos.getDepartamentos();
      this.adapter.setLocale('es');
      this.minDate = new Date()
      this.myFilter = (d: any): boolean => {
        const day = d.weekday();
        return day !== 5 && day !== 6;
      }

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
    this.errorFecha = false;
    this._bottomSheetRef.dismiss();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  removeErrorFecha() {
    this.errorFecha = false;
  }

  async checkFecha() {
    return await new Promise((resolve, reject) => {
      this.validator.checkFecha(this.copyFecha).then(() => {
        resolve(true)
      }).catch(() => {
        this.errorFecha = true;
      })
    })
  }

  guardar() {
    switch (this.data.page) {
      case "editarDescripcion":
      case "editarAmbito":
      case "editarDepartamento":
        this.storeBasicData()
        this._bottomSheetRef.dismiss();
      case "editarFecha":
        this.checkFecha().then(() => {
          this.storeBasicData()
          this._bottomSheetRef.dismiss();
        })
        break;
      case "editarOpciones":
        this.checkOptions().then(() => {
          var datos = {codigo: this.data.votacion.codigo, opciones: this.opciones}
          this.controllerBD.modificarOpcionesVotacion(datos).then((result) => {
            console.log(result);
          }).catch(err => {
            console.log(err);
          });
          this._bottomSheetRef.dismiss();
        })
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
          console.log(err);
        });
        this._bottomSheetRef.dismiss();
        break;
    }
  }

  check2Options() {
    if (this.opciones[0] == "" || this.opciones[1] == "") {
      this.errors["options"] = "requiredAlert"
      setTimeout(() => {
        delete this.errors["options"]
      }, 2000)
      return false;
    } else {
      return true;
    }
  }

  removeErrorOption(i) {
    this.errorOptions[i] = false;
    for (var k of Object.keys(this.opciones)) {
      if (this.opciones[k] == this.opciones[i]) {
        this.errorOptions[k] = false;
      }
    }
    var allFalse = true
    for (var op of this.errorOptions) {
      if (op) {
        allFalse = false;
        break;
      }
    }
    if (allFalse) {
      delete this.errors['options']
    }
  }

  async checkOptions() {
    delete this.errors["options"]
    return await new Promise((resolve, reject) => {
      this.validator.checkOptions(this.opciones).then((opt) => {
        this.changeOptions(opt)
        resolve(true)
      }).catch((res) => {
        var errors = res[0]
        var opt = res[1]
        this.errors["options"] = errors["options"]
        this.changeOptions(opt)
        if (this.errors["options"] == "duplicated") {
          this.markOptionErrors()
        }
      })
    })
  }

  markOptionErrors() {
    for (var k of Object.keys(this.opciones)) {
      this.errorOptions[k] = false;
    }
    if (this.errors["options"] == "duplicated") {
      var opt = []
      for (var op of this.opciones) {
        if (opt.includes(op)) {
          for (var k of Object.keys(this.opciones)) {
          var op2 = this.opciones[k]
            if (op2 == op) {
              this.errorOptions[k] = true;
            }
          }
        } 
        else {
          opt.push(op)
        }
      }
      console.log(this.errorOptions)
    } else {
      for (var k of Object.keys(this.opciones)) {
        if (this.opciones[k] == "") {
          this.errorOptions[k] = true;
        } else {
          this.errorOptions[k] = false;
        }
      }
    }
  }

  changeOptions(opt) {
    this.opciones = []
    for (var k of Object.keys(opt)) {
      this.opciones[k] = this.capitalizeString(opt[k])
    }
  }

  storeBasicData() {
    this.data.votacion.descripcion = this.copyDescripcion
    this.data.votacion.ambito = this.copyAmbito
    this.data.votacion.f_votacion = this.copyFecha
    this.data.votacion.departamento = this.copyDepartamento

    this.controllerBD.modificarVotacion(this.data.votacion).then((result) => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }

  deleteOption(i) {
    this.removeErrorOption(i)
    this.opciones.splice(i, 1);
    this.errorOptions.splice(i, 1)
  }

  addOption() {
    if (this.opciones.length < 6) {
      if (this.check2Options()) {
        this.opciones.push("")
        this.errorOptions.push(false);
      }
    }
  }

  //Método para borrar usuario

  deleteUser(id) {
    this.participantes.splice(id, 1);
    this.obtenerUsuarios();
  }

  //Métodos para añadir nuevos usuarios

  obtenerUsuarios() {
    this.freeParticipants = 6 - this.participantes.length;
    console.log(this.freeParticipants)
    var res = []
    for (var us of this.participantes) {
      res.push(us.dni)
    }
    var body = {participantes: res}
    this.usuarios = []
    this.boolSelected = {}
    this.selected = [];
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
    this.disabled = false;
    this.selected = [];
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
    this.obtenerUsuarios();
  }

  cancelAddingUser() {
    this.addingUser = false;
    this.obtenerUsuarios();
  }

  capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  openSnackBar() {
    var message = "Se ha alcanzado el máximo de participantes (6)"
    var action = "Cerrar"

    let config = new MatSnackBarConfig();
    config.duration = 3000000;
    config.panelClass = ['alert-snackbar']

    this._snackBar.open(message, action, config);
  }

  selection(user) {
    if (this.isSelected(user)) {
      this.freeParticipants++;
      this.selected.splice(this.selected.indexOf(user), 1)
    } else {
      if (this.freeParticipants > 0) {
        this.freeParticipants--;
        this.selected.push(user)
      } else {
        this.openSnackBar()
        setTimeout(() => {
          this.disabled = true
        }, 500)
      }
    }
    this.calcularTotal()
  }

  calcularTotal() {
    if (this.freeParticipants == 0) {
      setTimeout(() => {
        this.disabled = true
      }, 500)
    } else {
      this.disabled = false;
    } 
  }

  isSelected(user) {
    if (this.selected.includes(user)) {
      return true;
    }
    return false;
  }
}
