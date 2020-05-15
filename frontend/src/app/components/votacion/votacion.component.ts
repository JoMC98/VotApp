import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { DesplegableVotacionComponent } from './desplegable-votacion/desplegable-votacion.component';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { VotacionValidatorService } from 'src/app/services/validators/votacion/votacion-validator.service';

@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.css']
})
export class VotacionComponent implements OnInit, OnDestroy {
  dni: string;
  codigo: number;
  home: boolean;
  participa: boolean;

  admin: boolean;

  private sub: any;
  private subQ: any;

  modificarPregunta: boolean = false;
  copyPregunta: string = "";
  editing = false;

  listaDepartamentos = {};

  votacion = {codigo:"", pregunta:"", descripcion:"", estado:"", departamento:"", f_votacion:"", ambito:"", opciones:"", participantes:""};

  opciones = [];
  participantes = [];

  interval;

  errorPregunta = false;

  constructor(private route: ActivatedRoute, private _bottomSheet: MatBottomSheet, private router: Router, 
    private controllerBD: DatabaseControllerService,  private listDepartamentos: ListaDepartamentosService, 
    private sessionController: SessionControllerService, private validator: VotacionValidatorService) { 
    this.admin = sessionController.getAdminSession();
    this.dni = sessionController.getDNISession();
  }

  rutar() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigate(['/votar', this.codigo]);
        res();
      }, 400);
    })
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.codigo = +params['codigo']; 
      this.listaDepartamentos = this.listDepartamentos.getDepartamentos();
      this.loopDataQuery()
      this.getDatos();
    });
    this.subQ = this.route.queryParams.subscribe(params => {
    this.home = JSON.parse(params['home']); 
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval)
    this.interval = null;
    // this.sub.unsubscribe();
    // this.subQ.unsubscribe();
  }

  loopDataQuery() {
    this.controllerBD.obtenerVotacion(this.codigo).then((result) =>{
      this.votacion = result[0];
      this.interval = setInterval(() => {
        this.controllerBD.obtenerVotacion(this.codigo).then((result) =>{
          this.votacion = result[0];
        })
      }, 5000);
    })
  }

  getDatos() {
    this.controllerBD.obtenerOpcionesVotacion(this.codigo).then((result) =>{
      this.opciones = []
      for (let i of Object.keys(result)) {
        this.opciones.push(result[i].opcion)
      }
    });
    this.controllerBD.obtenerParticipantesVotacion(this.codigo).then((result) =>{
      this.participantes = []
      this.participa = false;
      for (let i of Object.keys(result)) {
        this.participantes.push(result[i])
        if (result[i].dni == this.dni) {
          this.participa = true;
        }
      }
    });
  }

  capitalizePregunta(str) {
    if (str.length == 0) {
      return str 
    } else {
      var first = str.charAt(0)
      var last = str.charAt(str.length - 1)
      if (first != "¿") {
        str = "¿" + str
      }
      if (last != "?") {
        str = str + "?"
      }
      str = "¿" + str.charAt(1).toUpperCase() + str.slice(2)
      return str
    }
  }

  modifyPregunta() {
    this.modificarPregunta = !this.modificarPregunta;
    this.copyPregunta = this.votacion.pregunta;
    this.editing = true;
  }

  guardarPregunta() {
    this.validator.checkPregunta(this.copyPregunta).then(() => {
      this.votacion.pregunta = this.capitalizePregunta(this.copyPregunta);
      this.controllerBD.modificarVotacion(this.votacion).then((result) => {
        console.log(result);
      }).catch(err => {
        console.log(err);
      });
      this.modificarPregunta = !this.modificarPregunta;
      this.editing = false;
    }).catch(() => {
      this.errorPregunta = true;
    })
  }

  removeErrorPregunta() {
    this.errorPregunta = false;
  }

  cancelarPregunta() {
    this.modificarPregunta = !this.modificarPregunta;
    this.editing = false;
    this.errorPregunta = false;
  }

  openDialog(page){
    var datos = {page: page};
    datos["votacion"] = this.votacion
    datos["copyParticipantes"] = this.participantes
    datos["copyOpciones"] = this.opciones

    if (page.startsWith("editar")) {
      this.editing = true;
    }

    const filterRef = this._bottomSheet.open(DesplegableVotacionComponent, 
      {data: datos});

    filterRef.afterDismissed().subscribe(result => {
      if (page.startsWith("editar")) {
        this.editing = false;
      }
      switch (page) {
        case "editarOpciones":
        case "editarParticipantes":
          this.getDatos();
      }
    })
  }


}
