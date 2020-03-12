import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet'
import { FiltroUsersComponent } from '../../filtro-users/filtro-users.component';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.css']
})
export class ParticipantesComponent implements OnInit {
  /*participantes = {"Administración" : {values: [["Paco Rodriguez", "Jefe de Abastecimiento"], ["Manolo Fuentes", "Secretario general de Administración"], ["Lorenzo Fernandez", "CCO"]], selected : 0},
                   "Marketing" : {values: [["Paco Rodriguez", "Jefe de Comerciales"], ["Manolo Fuentes", "Secretario general de Marketing"], ["Lorenzo Fernandez", "CCO"], ["Paco Rodrigue Garcia", "CMO"], ["Manolo Fuentes", "CTO"]], selected : 0},
                   "Finanzas" : {values: [["Paco Rodriguez", "Jefe de Prensa"], ["Manolo Fuentes", "Secretario general de Administración"], ["Lorenzo Fernandez", "CCO"]], selected : 0},
                   "Dirección" : {values: [["Paco Rodriguez", "Jefe de Abastecimiento"], ["Manolo Fuentes", "CEO"], ["Lorenzo Fernandez", "CCO"], ["Paco Rodriguez", "CMO"], ["Manolo Fuentes", "CTO"]], selected : 0},
                  };*/

  total: number = 0;

  usuarios = [];
  users = {};

  nombre = {"nombre":""};
  cargo = {"cargo":""};
  departamentos = {"Administración":false,"Dirección":false,"Marketing":false,"Finanzas":false}

  constructor(private _bottomSheet: MatBottomSheet) {
    this.usuarios = [
        {dni:"12345678X", nombre: "Paco", apellido: "Gonzalez Lopez", departamento: "Administración", cargo:"Jefe de Abastecimiento",selected:false},
        {dni:"12345679X", nombre: "Mario", apellido: "Mir Dos", departamento: "Administración", cargo:"Jefe de Suministros",selected:false},
        {dni:"12345670X", nombre: "Luis", apellido: "Alvarez Lopez", departamento: "Dirección", cargo:"CEO",selected:false},
        {dni:"12345623X", nombre: "Ana", apellido: "Garcia Fernandez", departamento: "Marketing", cargo:"CMO",selected:false},
        {dni:"12345643A", nombre: "Juan", apellido: "De los palomos Garcia", departamento: "Finanzas", cargo:"Jefe de Ventas",selected:false},
        {dni:"12345612D", nombre: "Valentina", apellido: "Del arco Alarcon", departamento: "Dirección", cargo:"Jefe de Comerciales",selected:false},
        {dni:"13525678X", nombre: "Eustaquio", apellido: "Roca Zaragoza", departamento: "Administración", cargo:"CTO",selected:false},
        {dni:"85678678X", nombre: "Paco", apellido: "Lopez Torres", departamento: "Marketing", cargo:"CFO",selected:false},
        {dni:"96856678X", nombre: "Jordi", apellido: "Villa Parejo", departamento: "Marketing", cargo:"Secretario General",selected:false},
        {dni:"16456678X", nombre: "Manolo", apellido: "Betis Balompie", departamento: "Finanzas", cargo:"Asesor financiero",selected:false}];
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

  mostrarOcultar(key) {
    let valActual = document.getElementById('dpto' + key).style.display;
    let valNuevo = (valActual == 'none' ? 'block' : 'none');
    document.getElementById('dpto' + key).style.display = valNuevo;

    let icon = document.getElementById('flecha' + key).classList[2];;

    if (valNuevo == 'none' && icon == "fa-chevron-down") {
      document.getElementById('flecha' + key).classList.remove("fa-chevron-down");
      document.getElementById('flecha' + key).classList.add("fa-chevron-right");
    } else if (valNuevo == 'block' && icon == "fa-chevron-right") {
      document.getElementById('flecha' + key).classList.remove("fa-chevron-right");
      document.getElementById('flecha' + key).classList.add("fa-chevron-down");
    }
  }

  selection(inicial, user) {
    var actual = this.users[inicial][this.users[inicial].indexOf(user)].selected;
    this.users[inicial][this.users[inicial].indexOf(user)].selected = !actual;
    if (actual) {
      this.total -= 1;
    } else {
      this.total += 1;
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

  metodo() {
    console.log("he");
  }

  /*selection(checked, key, id) {
    if (checked) {
      this.participantes[key].selected += 1;
      this.total += 1;
      document.getElementById("checkbox-" + key + "-" + id).style.color = "#D1967D";
    } else {
      this.participantes[key].selected -= 1;
      this.total -= 1;
      document.getElementById("checkbox-" + key + "-" + id).style.color = "white";
    }
  }*/
}
