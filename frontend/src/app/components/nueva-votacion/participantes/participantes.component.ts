import { Component, OnInit, Input } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet'
import { FiltroUsersComponent } from '../../filtro-users/filtro-users.component';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';

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

  nombre = {"nombre":""};
  apellidos = {"apellidos":""};
  cargo = {"cargo":""};

  departamentos = {}
  listaDepartamentos = {};

  @Input() data;

  constructor(private _bottomSheet: MatBottomSheet, private controllerBD: DatabaseControllerService,  private listDepartamentos: ListaDepartamentosService) {
    this.listaDepartamentos = this.listDepartamentos.getDepartamentos();
    this.departamentos = this.listDepartamentos.getDepartamentosJSONFalse();

    this.controllerBD.obtenerUsuarios().then((result) =>{
      for (let i of Object.keys(result)) {
        this.usuarios.push(result[i])
      }
      this.generarListado(this.usuarios);
    });
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
  }

  selection(dni) {
    if (this.isSelected(dni)) {
      this.data.splice(this.data.indexOf(dni), 1)
    } else {
      this.data.push(dni)
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
