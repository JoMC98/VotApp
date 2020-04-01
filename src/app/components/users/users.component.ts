import { FiltroUsersComponent } from '../filtro-users/filtro-users.component';
import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet'
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';



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

  constructor(private _bottomSheet: MatBottomSheet, private controllerBD: DatabaseControllerService) {
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
