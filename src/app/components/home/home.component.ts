import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  nombre: string = "Paco";
  admin: boolean = false;
  // admin: boolean = true;

  votacionesAdmin = [
    {id: 1, pregunta: "¿Deberíamos abrir otra sucursal en Alicante?", estado: "Finalizada", departamento: "Administración", ambito: "Privada", fecha: new Date("2020-01-20")},
    {id: 2, pregunta: "¿Deberíamos abrir otra sucursal en La Vall?", estado: "Creada", departamento: "Administración", ambito: "Oculta", fecha: new Date("2020-04-16")},
    {id: 3, pregunta: "¿Deberíamos abrir otra sucursal en Barcelona?", estado: "Creada", departamento: "Dirección", ambito: "Departamento", fecha: new Date("2020-04-18")},
    {id: 4, pregunta: "¿Deberíamos abrir otra sucursal en Castellon?", estado: "Activa", departamento: "Marketing", ambito: "Departamento", fecha: new Date("2020-03-8")}];
    
  votacionesVotante = [
    {id: 1, pregunta: "¿Deberíamos abrir otra sucursal en Alicante?", estado: "Finalizada", departamento: "Administración", ambito: "Privada", fecha: new Date("2020-01-20")},
    {id: 2, pregunta: "¿Deberíamos abrir otra sucursal en La Vall?", estado: "Creada", departamento: "Administración", ambito: "Oculta", fecha: new Date("2020-04-16")},
    {id: 3, pregunta: "¿Deberíamos abrir otra sucursal en Barcelona?", estado: "Creada", departamento: "Dirección", ambito: "Departamento", fecha: new Date("2020-04-18")},
    {id: 4, pregunta: "¿Deberíamos abrir otra sucursal en Castellon?", estado: "Activa", departamento: "Marketing", ambito: "Departamento", fecha: new Date("2020-03-8")},
    {id: 5, pregunta: "¿Deberíamos abrir otra sucursal en Valencia?", estado: "Creada", departamento: "Administración", ambito: "Privada", fecha: new Date("2020-03-16")},
    {id: 6, pregunta: "¿Deberíamos abrir otra sucursal en Zaragoza?", estado: "Finalizada", departamento: "Administración", ambito: "Publica", fecha: new Date("2020-03-4")}];

  constructor() { }

  ngOnInit(): void {
  }

  change() {
    this.admin = !this.admin;
  }

}
