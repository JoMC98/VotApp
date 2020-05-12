import { Component, OnInit, Input } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet'
import { FiltroUsersComponent } from '../../filtro-users/filtro-users.component';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.css']
})
export class ParticipantesComponent implements OnInit {

  total: number = 0;

  usuarios = [];
  users = {};
  selected = {};
  disabled = false;

  nombre = {"nombre":""};
  apellidos = {"apellidos":""};
  cargo = {"cargo":""};

  departamentos = {}
  listaDepartamentos = {};

  @Input() data;

  constructor(private _bottomSheet: MatBottomSheet, private controllerBD: DatabaseControllerService,  private listDepartamentos: ListaDepartamentosService, private _snackBar: MatSnackBar) {
    this.listaDepartamentos = this.listDepartamentos.getDepartamentos();
    this.departamentos = this.listDepartamentos.getDepartamentosJSONFalse();

    this.controllerBD.obtenerUsuarios().then((result) =>{
      for (let i of Object.keys(result)) {
        this.usuarios.push(result[i])
      }
      this.generarListado(this.usuarios);
    });
  }

  openSnackBar() {
    var message = "Se ha alcanzado el máximo de participantes (6)"
    var action = "Cerrar"

    let config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = ['alert-snackbar']

    this._snackBar.open(message, action, config);
  }


  ngOnInit(): void {
    this.generarListado(this.usuarios);
  }

  isSelected(dni) {
    if (this.data.includes(dni)) {
      return true;
    }
    return false;
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
      if (this.isSelected(user.dni)) {
        this.selected[user.dni] = true;
      } else {
        this.selected[user.dni] = false;
      }
    }
  }

  calcularTotal() {
    this.total = this.data.length;
    if (this.total == 6) {
      setTimeout(() => {
        this.disabled = true
      }, 500)
    } else {
      this.disabled = false;
    } 
  }

  selection(dni) {
    if (this.isSelected(dni)) {
      this.data.splice(this.data.indexOf(dni), 1)
    } else {
      if (this.total < 6) {
        this.data.push(dni)
      } else {
        this.openSnackBar()
      }
    }
    this.calcularTotal();
  }

  openDialog(): void {
    const filterRef = this._bottomSheet.open(FiltroUsersComponent, 
      {data: {nombre:this.nombre, apellidos:this.apellidos, cargo:this.cargo, departamentos:this.departamentos}});

    filterRef.afterDismissed().subscribe(result => {
      this.filtrarResultados();
    })
  }

  filtrarResultados() {
    var dpts = []
    for (var dpt of Object.keys(this.departamentos)) {
      if (this.departamentos[dpt]){
        dpts.push(dpt)
      } 
    }
    if (this.nombre.nombre == "" && this.apellidos.apellidos == "" && this.cargo.cargo == "" && dpts.length == 0) {
      this.controllerBD.obtenerUsuarios().then((result) => {
        this.usuarios = [];
        for (let i of Object.keys(result)) {
          this.usuarios.push(result[i])
        }
        this.generarListado(this.usuarios);
      });
    } else {
      if (dpts.length == 0) {
        for (var dpt of Object.keys(this.departamentos)) {
          dpts.push(dpt)
        }
      }
      var filtros = {nombre: this.nombre.nombre, apellidos:this.apellidos.apellidos, cargo:this.cargo.cargo, departamentos:dpts}
      this.controllerBD.filtrarUsuarios(filtros).then((result) => {
        this.usuarios = [];
        for (let i of Object.keys(result)) {
          this.usuarios.push(result[i])
        }
        this.generarListado(this.usuarios);
      });
    }
  }
}
