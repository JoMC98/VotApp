import { FiltroVotacionesComponent } from './filtro-votaciones/filtro-votaciones.component';
import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

export interface FilterData {
  pregunta;
  estados;
  ambitos;
  departamentos;
}

@Component({
  selector: 'app-listado-votaciones',
  templateUrl: './listado-votaciones.component.html',
  styleUrls: ['./listado-votaciones.component.css']
})

export class ListadoVotacionesComponent implements OnInit {
  votes = [];
  votaciones = {};

  pregunta = {"pregunta":""};
  estados = {"Activa":false,"En proceso":false,"Finalizada":false}
  ambitos = {"Pública":false,"Privada":false,"Departamento":false,"Oculta":false}
  departamentos = {"Administración":false,"Dirección":false,"Marketing":false,"Finanzas":false}

  order = 'Descendente';

  constructor(private _bottomSheet: MatBottomSheet) {
    this.votes = [
      {pregunta: "¿Deberíamos abrir otra sucursal en Alicante?", estado: "Finalizada", departamento: "Administración", ambito: "Privada", fecha: new Date("2020-01-20")},
      {pregunta: "¿Deberíamos abrir otra sucursal en La Vall?", estado: "Activa", departamento: "Administración", ambito: "Oculta", fecha: new Date("2020-04-16")},
      {pregunta: "¿Deberíamos abrir otra sucursal en Barcelona?", estado: "Activa", departamento: "Dirección", ambito: "Departamento", fecha: new Date("2020-04-18")},
      {pregunta: "¿Deberíamos abrir otra sucursal en Castellon?", estado: "Activa", departamento: "Marketing", ambito: "Departamento", fecha: new Date("2020-03-8")},
      {pregunta: "¿Deberíamos abrir otra sucursal en Valencia?", estado: "Activa", departamento: "Administración", ambito: "Privada", fecha: new Date("2020-03-16")},
      {pregunta: "¿Deberíamos abrir otra sucursal en Zaragoza?", estado: "En proceso", departamento: "Administración", ambito: "Publica", fecha: new Date("2020-03-4")}, 
      {pregunta: "¿Deberíamos abrir otra sucursal en Madrid?", estado: "Finalizada", departamento: "Administración", ambito: "Pública", fecha: new Date("2020-02-18")},
      {pregunta: "¿Deberíamos abrir otra sucursal en Galicia?", estado: "Finalizada", departamento: "Finanzas", ambito: "Privada", fecha: new Date("2020-02-01")}];
    this.generarListado(this.votes);
  }

  ngOnInit(): void {
  }

  generarListado(listado) {
    this.votaciones = {};
    for (let vote of listado) {
      var f = vote.fecha;
      var mes = f.getFullYear() + "-" + (f.getMonth()+1) + "-01";
      if (this.votaciones[mes]) {
        this.votaciones[mes].push(vote);
      } else {
        this.votaciones[mes] = [vote];
      }
    }
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

  openDialog(): void {
    const filterRef = this._bottomSheet.open(FiltroVotacionesComponent, 
      {data: {pregunta:this.pregunta, estados:this.estados, ambitos:this.ambitos, departamentos:this.departamentos}});

    filterRef.afterDismissed().subscribe(result => {
      let listado = this.votes;
      let delet = [];

      if(this.pregunta.pregunta != "") {
        console.log("Pregunta que incluya --> " + this.pregunta.pregunta);
        
        for (let v of listado) {
          console.log(v);
          if (!(v.pregunta.toLowerCase()).includes(this.pregunta.pregunta.toLowerCase())) {
            delet.push(listado.indexOf(v));
          }
        }
      }
      

      if(this.estados.Activa || this.estados["En proceso"] || this.estados.Finalizada) {
        console.log("Estados: ");
        for (let est of Object.keys(this.estados)) {
          if (this.estados[est])
            console.log(est)
        }
      }

      if(this.ambitos.Departamento || this.ambitos.Oculta || this.ambitos.Privada || this.ambitos.Pública) {
        console.log("Ámbitos: ");
        for (let amb of Object.keys(this.ambitos)) {
          if (this.ambitos[amb])
            console.log(amb)
        }
      }

      if(this.departamentos.Administración || this.departamentos.Dirección || this.departamentos.Finanzas || this.departamentos.Marketing ) {
        console.log("Departamentos: ");
        for (let dpt of Object.keys(this.departamentos)) {
          if (this.departamentos[dpt])
            console.log(dpt)
        }
      }

      //this.generarListado(listado);
      
    })
  }
}