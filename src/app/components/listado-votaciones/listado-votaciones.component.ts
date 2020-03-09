import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listado-votaciones',
  templateUrl: './listado-votaciones.component.html',
  styleUrls: ['./listado-votaciones.component.css']
})
export class ListadoVotacionesComponent implements OnInit {
  votaciones = { "2020-04-01" : [
                  {pregunta: "¿Deberíamos abrir otra sucursal en La Vall?", estado: "Activa", departamento: "Administración", ambito: "Oculta", fecha: new Date("2020-04-16")},
                  {pregunta: "¿Deberíamos abrir otra sucursal en Barcelona?", estado: "Activa", departamento: "Dirección", ambito: "Departamento", fecha: new Date("2020-04-18")}],
                "2020-03-01" : [
                  {pregunta: "¿Deberíamos abrir otra sucursal en Castellon?", estado: "Activa", departamento: "Marketing", ambito: "Departamento", fecha: new Date("2020-03-8")},
                  {pregunta: "¿Deberíamos abrir otra sucursal en Valencia?", estado: "Activa", departamento: "Administración", ambito: "Privada", fecha: new Date("2020-03-16")},
                  {pregunta: "¿Deberíamos abrir otra sucursal en Zaragoza?", estado: "En proceso", departamento: "Administración", ambito: "Publica", fecha: new Date("2020-03-4")}],
                "2020-02-01" : [  
                  {pregunta: "¿Deberíamos abrir otra sucursal en Madrid?", estado: "Finalizada", departamento: "Administración", ambito: "Pública", fecha: new Date("2020-02-18")},
                  {pregunta: "¿Deberíamos abrir otra sucursal en Galicia?", estado: "Finalizada", departamento: "Finanzas", ambito: "Privada", fecha: new Date("2020-02-01")}],
                "2020-01-01" : [  
                  {pregunta: "¿Deberíamos abrir otra sucursal en Alicante?", estado: "Finalizada", departamento: "Administración", ambito: "Privada", fecha: new Date("2020-01-20")}]};

  order = 'Descendente';
  mode = "over";

  constructor() { }

  ngOnInit(): void {
  }

  mostrarOcultar(key) {
    let valActual = document.getElementById('votacionesMes' + key).style.display;
    let valNuevo = (valActual == 'none' ? 'block' : 'none');
    document.getElementById('votacionesMes' + key).style.display = valNuevo;

    let icon = document.getElementById('flecha' + key).classList[2];;

    if (valNuevo == 'none' && icon == "fa-chevron-down") {
      document.getElementById('flecha' + key).classList.remove("fa-chevron-down");
      document.getElementById('flecha' + key).classList.add("fa-chevron-right");
    } else if (valNuevo == 'block' && icon == "fa-chevron-right") {
      document.getElementById('flecha' + key).classList.remove("fa-chevron-right");
      document.getElementById('flecha' + key).classList.add("fa-chevron-down");
    }
  }

}
