import { FiltroVotacionesComponent } from './filtro-votaciones/filtro-votaciones.component';
import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';

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
  meses = [];

  pregunta = {"pregunta":""};
  estados = {"Activa":false,"Creada":false,"Finalizada":false}
  ambitos = {"Pública":false,"Privada":false,"Departamento":false,"Oculta":false}
  departamentos = {}

  order = 'Descendente';

  constructor(private _bottomSheet: MatBottomSheet, private controllerBD: DatabaseControllerService, private listDepartamentos: ListaDepartamentosService) {
    this.departamentos = this.listDepartamentos.getDepartamentosJSONFalse();

    this.controllerBD.obtenerVotaciones().then((result) =>{
      for (let i of Object.keys(result)) {
        this.votes.push(result[i])
      }
      this.generarListado(this.votes);
    });
  }

  ngOnInit(): void {
  }

  generarListado(listado) {
    this.votaciones = {};
    this.meses = [];
    for (let vote of listado) {
      var f = new Date(vote.f_votacion);
      var mes = f.getFullYear() + "-" + (f.getMonth()+1) + "-01";
      if (this.meses.includes(mes)) {
        this.votaciones[mes].push(vote);
      }
      else {
        this.votaciones[mes] = [vote];
        this.meses.push(mes)
      } 
    }
    this.ordenarListado();
  }

  select() {
    this.ordenarListado()
  }

  ordenarListado() {
    this.meses.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });

    for (var mes of Object.keys(this.votaciones)) {
      var list = this.votaciones[mes];
      list.sort((a: any, b: any) => {
        if ((a.f_votacion) < (b.f_votacion)) {
          return -1;
        } else if ((a.f_votacion) > (b.f_votacion)) {
          return 1;
        } else {
          return 0;
        }
      });
      if (this.order == "Descendente") {
        list = list.reverse();
      }
      this.votaciones[mes] = list
    }
    if (this.order == "Descendente") {
      this.meses = this.meses.reverse();
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
    var states = []
    for (var state of Object.keys(this.estados)) {
      if (this.estados[state]){
        states.push(state)
      } 
    }
    var ambs = []
    for (var amb of Object.keys(this.ambitos)) {
      if (this.ambitos[amb]){
        ambs.push(amb)
      } 
    }
    if (this.pregunta.pregunta == "" && dpts.length == 0 && states.length == 0 && ambs.length == 0) {
      this.controllerBD.obtenerVotaciones().then((result) =>{
        this.votes = []
        for (let i of Object.keys(result)) {
          this.votes.push(result[i])
        }
        this.generarListado(this.votes);
      });
    } else {
      if (dpts.length == 0) {
        for (var dpt of Object.keys(this.departamentos)) {
          dpts.push(dpt)
        }
      }
      if (states.length == 0) {
        for (var state of Object.keys(this.estados)) {
          states.push(state)
        }
      }
      if (ambs.length == 0) {
        for (var amb of Object.keys(this.ambitos)) {
          ambs.push(amb)
        }
      }
      var filtros = {pregunta:this.pregunta.pregunta, estados:states, ambitos:ambs, departamentos:dpts}
      this.controllerBD.filtrarVotaciones(filtros).then((result) => {
        this.votes = [];
        for (let i of Object.keys(result)) {
          this.votes.push(result[i])
        }
        this.generarListado(this.votes);
      });
    }
  }

  marcadoDepartamento() {
    for (var k of Object.keys(this.departamentos)){
      if (this.departamentos[k]) {
        return true;
      }
    }
    return false;
  }
}