import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, OnDestroy {

  id: number;
  private sub: any;

  pregunta: string = "¿Deberiamos abrir una nueva sucursal en Valencia?";
  participantes = {};

  users = [];

  user = 0;
  heightClass: string = "";

  conexions: number = 0;
  totalConexions: number;

  constructor(private route: ActivatedRoute) {
    this.users = [
                {"12345678X": {dni:"12345678X", nombre: "Paco", apellido: "Gonzalez Lopez", departamento: "Administración", cargo:"Jefe de Abastecimiento", vpn: false, votacion: false},
                "12345679X": {dni:"12345679X", nombre: "Mario", apellido: "Mir Dos", departamento: "Administración", cargo:"Jefe de Suministros", vpn: false, votacion: false},
                "12345623X": {dni:"12345623X", nombre: "Ana", apellido: "Garcia Fernandez", departamento: "Marketing", cargo:"CMO", vpn: false, votacion: false}},

                {"12345678X": {dni:"12345678X", nombre: "Paco", apellido: "Gonzalez Lopez", departamento: "Administración", cargo:"Jefe de Abastecimiento", vpn: false, votacion: false},
                "12345679X": {dni:"12345679X", nombre: "Mario", apellido: "Mir Dos", departamento: "Administración", cargo:"Jefe de Suministros", vpn: false, votacion: false},
                "12345670X": {dni:"12345670X", nombre: "Luis", apellido: "Alvarez Lopez", departamento: "Dirección", cargo:"CEO", vpn: false, votacion: false},
                "12345623X": {dni:"12345623X", nombre: "Ana", apellido: "Garcia Fernandez", departamento: "Marketing", cargo:"CMO", vpn: false, votacion: false}},

                {"12345678X": {dni:"12345678X", nombre: "Paco", apellido: "Gonzalez Lopez", departamento: "Administración", cargo:"Jefe de Abastecimiento", vpn: false, votacion: false},
                "12345679X": {dni:"12345679X", nombre: "Mario", apellido: "Mir Dos", departamento: "Administración", cargo:"Jefe de Suministros", vpn: false, votacion: false},
                "12345670X": {dni:"12345670X", nombre: "Luis", apellido: "Alvarez Lopez", departamento: "Dirección", cargo:"CEO", vpn: false, votacion: false},
                "12345623X": {dni:"12345623X", nombre: "Ana", apellido: "Garcia Fernandez", departamento: "Marketing", cargo:"CMO", vpn: false, votacion: false},
                "12345643A": {dni:"12345643A", nombre: "Juan", apellido: "Comins Garcia", departamento: "Finanzas", cargo:"Jefe de Ventas", vpn: false, votacion: false}},

                {"12345678X": {dni:"12345678X", nombre: "Paco", apellido: "Gonzalez Lopez", departamento: "Administración", cargo:"Jefe de Abastecimiento", vpn: false, votacion: false},
                "12345679X": {dni:"12345679X", nombre: "Mario", apellido: "Mir Dos", departamento: "Administración", cargo:"Jefe de Suministros", vpn: false, votacion: false},
                "12345670X": {dni:"12345670X", nombre: "Luis", apellido: "Alvarez Lopez", departamento: "Dirección", cargo:"CEO", vpn: false, votacion: false},
                "12345623X": {dni:"12345623X", nombre: "Ana", apellido: "Garcia Fernandez", departamento: "Marketing", cargo:"CMO", vpn: false, votacion: false},
                "12345643A": {dni:"12345643A", nombre: "Juan", apellido: "Comins Garcia", departamento: "Finanzas", cargo:"Jefe de Ventas", vpn: false, votacion: false},
                "12345642A": {dni:"12345642A", nombre: "Alberto", apellido: "Fernandez Lopez", departamento: "Finanzas", cargo:"Jefe de Ventas", vpn: false, votacion: false}},
    ];
    this.participantes = this.users[this.user];
    this.heightClass = "divParticipanteStartVotacion" + Object.keys(this.participantes).length;
    this.totalConexions = Object.keys(this.participantes).length * 2;
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; 
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  cambiarParticipantes() {
    this.user += 1;
    if (this.user == this.users.length) {
      this.user = 0;
    }
    this.conexions = 0;
    this.totalConexions = Object.keys(this.participantes).length * 2;
    this.participantes = this.users[this.user];
    this.heightClass = "divParticipanteStartVotacion" + Object.keys(this.participantes).length;
  }

  changeColor() {
    var keys = Object.keys(this.participantes);
    var user = Math.trunc(this.conexions / 2);
    var opt = (this.conexions % 2 == 0 ? "vpn" : "votacion");
    this.participantes[keys[user]][opt] = true;
    this.conexions += 1;
  }

}
