import { FiltroUsersComponent } from '../filtro-users/filtro-users.component';
import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet'
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  order = 'Ascendente';
  filtrado = false;

  usuarios = [];
  users = {};
  iniciales = [];

  nombre = {"nombre":""};
  apellidos = {"apellidos":""};
  cargo = {"cargo":""};

  departamentos = {}
  listaDepartamentos = {};

  constructor(private _bottomSheet: MatBottomSheet, private controllerBD: DatabaseControllerService, private listDepartamentos: ListaDepartamentosService) {
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
  }

  generarListado(listado) {
    this.users = {};
    this.iniciales = [];
    for (let user of listado) {
      var inicial = user.nombre.charAt(0);
      if (this.iniciales.includes(inicial)) {
        this.users[inicial].push(user);
      }
      else {
        this.users[inicial] = [user];
        this.iniciales.push(inicial)
      } 
    }
    this.ordenarListado();
  }

  select() {
    this.ordenarListado()
  }

  ordenarListado() {
    this.iniciales.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });

    for (var inicial of Object.keys(this.users)) {
      var list = this.users[inicial];
      list.sort((a: any, b: any) => {
        if ((a.nombre + " " + a.apellidos) < (b.nombre + " " + b.apellidos)) {
          return -1;
        } else if ((a.nombre + " " + a.apellidos) > (b.nombre + " " + b.apellidos)) {
          return 1;
        } else {
          return 0;
        }
      });
      if (this.order == "Descendente") {
        list = list.reverse();
      }
      this.users[inicial] = list
    }
    if (this.order == "Descendente") {
      this.iniciales = this.iniciales.reverse();
    }
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
