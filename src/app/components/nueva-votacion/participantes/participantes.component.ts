import { Component, OnInit, Input } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet'
import { FiltroUsersComponent } from '../../filtro-users/filtro-users.component';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';

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
  cargo = {"cargo":""};
  departamentos = {"Administración":false,"Dirección":false,"Marketing":false,"Finanzas":false}

  @Input() data;

  constructor(private _bottomSheet: MatBottomSheet, private controllerBD: DatabaseControllerService) {
    this.controllerBD.obtenerUsuarios().then((result) =>{
      for (let i of Object.keys(result)) {
        this.usuarios.push(result[i])
      }
      this.generarListado(this.usuarios);
    });
  }

  ngOnInit(): void {
    console.log(this.data)
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
    console.log(this.selected)
  }

  calcularTotal() {
    this.total = this.data.length;
  }

  selection(dni) {
    //var actual = this.users[inicial][this.users[inicial].indexOf(user)].selected;
    //this.users[inicial][this.users[inicial].indexOf(user)]["selected"] = !actual;
    if (this.isSelected(dni)) {
      this.data.splice(this.data.indexOf(dni), 1)
    } else {
      this.data.push(dni)
    }
    this.calcularTotal();
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
