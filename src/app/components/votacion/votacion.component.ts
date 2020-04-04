import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { DesplegableVotacionComponent } from './desplegable-votacion/desplegable-votacion.component';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';

@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.css']
})
export class VotacionComponent implements OnInit, OnDestroy {
  dni: string = "12345678X";
  // dni: string = "96856678X";
  codigo: number;
  home: boolean;

  // admin: boolean = true;
  admin: boolean = false;

  objectKeys = Object.keys;

  private sub: any;
  private subQ: any;

  modificarPregunta: boolean = false;
  copyPregunta: string = "";

  listaDepartamentos = {};

  votacion = {codigo:"", pregunta:"", descripcion:"", estado:"", departamento:"", f_votacion:"", ambito:"", opciones:"", participantes:""};

  opciones = [];
  participantes = [];

  constructor(private route: ActivatedRoute, private _bottomSheet: MatBottomSheet, private router: Router, private controllerBD: DatabaseControllerService,  private listDepartamentos: ListaDepartamentosService) { 
  }

  rutar() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigate(['/votar', this.codigo]);
        res();
      }, 400);
    })
  }

  cambiarAdmin() {
    this.admin = !this.admin;
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.codigo = +params['codigo']; 
      this.listaDepartamentos = this.listDepartamentos.getDepartamentos();
      this.getDatos();
    });
    this.subQ = this.route.queryParams.subscribe(params => {
    this.home = JSON.parse(params['home']); 
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subQ.unsubscribe();
  }

  getDatos() {
    this.controllerBD.obtenerVotacion(this.codigo).then((result) =>{
      this.votacion = result[0];
    });
    this.controllerBD.obtenerOpcionesVotacion(this.codigo).then((result) =>{
      this.opciones = []
      for (let i of Object.keys(result)) {
        this.opciones.push(result[i].opcion)
      }
    });
    this.controllerBD.obtenerParticipantesVotacion(this.codigo).then((result) =>{
      this.participantes = []
      for (let i of Object.keys(result)) {
        this.participantes.push(result[i])
      }
    });
  }

  modifyPregunta() {
    this.modificarPregunta = !this.modificarPregunta;
    this.copyPregunta = this.votacion.pregunta;
  }

  guardarPregunta() {
    this.votacion.pregunta = this.copyPregunta;
    this.controllerBD.modificarVotacion(this.votacion).then((result) => {
      console.log(result);
    });
    this.modificarPregunta = !this.modificarPregunta;
  }

  cancelarPregunta() {
    this.modificarPregunta = !this.modificarPregunta;
  }

  openDialog(page){
    var datos = {page: page};
    datos["votacion"] = this.votacion
    datos["copyParticipantes"] = this.participantes
    datos["copyOpciones"] = this.opciones
    const filterRef = this._bottomSheet.open(DesplegableVotacionComponent, 
      {data: datos});

    filterRef.afterDismissed().subscribe(result => {
      switch (page) {
        case "editarOpciones":
        case "editarParticipantes":
          this.getDatos();
      }
    })
  }


}
