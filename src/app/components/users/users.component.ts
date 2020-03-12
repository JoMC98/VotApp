import { FiltroUsersComponent } from '../filtro-users/filtro-users.component';
import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet'



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  order = 'Ascendente';

  usuarios = [];
  users = {};

  nombre = {"nombre":""};
  cargo = {"cargo":""};
  departamentos = {"Administración":false,"Dirección":false,"Marketing":false,"Finanzas":false}

  constructor(private _bottomSheet: MatBottomSheet) {
    this.usuarios = [
      {nombre: "Paco", apellido: "Gonzalez Lopez", departamento: "Administración", cargo:"Jefe de Abastecimiento"},
      {nombre: "Mario", apellido: "Mir Dos", departamento: "Administración", cargo:"Jefe de Suministros"},
      {nombre: "Luis", apellido: "Alvarez Lopez", departamento: "Dirección", cargo:"CEO"},
      {nombre: "Ana", apellido: "Garcia Fernandez", departamento: "Marketing", cargo:"CMO"},
      {nombre: "Juan", apellido: "De los palomos Garcia", departamento: "Finanzas", cargo:"Jefe de Ventas"},
      {nombre: "Valentina", apellido: "Del arco Alarcon", departamento: "Dirección", cargo:"Jefe de Comerciales"},
      {nombre: "Eustaquio", apellido: "Roca Zaragoza", departamento: "Administración", cargo:"CTO"},
      {nombre: "Paco", apellido: "Lopez Torres", departamento: "Marketing", cargo:"CFO"},
      {nombre: "Jordi", apellido: "Villa Parejo", departamento: "Marketing", cargo:"Secretario General"},
      {nombre: "Manolo", apellido: "Betis Balompie", departamento: "Finanzas", cargo:"Asesor financiero"}];
    this.generarListado(this.usuarios);
  }

  ngOnInit(): void {
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

  openDialog(): void {
    const filterRef = this._bottomSheet.open(FiltroUsersComponent, 
      {data: {nombre:this.nombre, cargo:this.cargo, departamentos:this.departamentos}});

    filterRef.afterDismissed().subscribe(result => {
      console.log(this.nombre);
      console.log(this.cargo);
      console.log(this.departamentos);
    })
  }


}
