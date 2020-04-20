import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DatosVotacionControllerService } from 'src/app/services/sockets/datos-votacion-controller.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit, OnDestroy {

  codigo: number;
  private sub: any;
  private destroy = false;

  totalParticipantes: number = 7;
  totalOpciones: number = 0;
  maximo: number = 0;

  pregunta: string = "";

  options = [];
  opciones = [];

  constructor(private route: ActivatedRoute, private controllerBD: DatabaseControllerService, private controllerVotacion: DatosVotacionControllerService) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.codigo = +params['codigo']; 
      this.controllerBD.obtenerResultadosVotacion(this.codigo).then((res) =>{
        this.pregunta = res["pregunta"];
        this.obtenerResultados();
      })
   });
  }

  obtenerResultados() {
    this.controllerBD.obtenerResultadosVotacion(this.codigo).then((res) =>{
      for (let i of Object.keys(res["resultados"])) {
        var opt = res["resultados"][i];
        opt["width"] = 0;
        this.opciones.push(opt)
      }
      console.log(this.opciones)

      this.totalOpciones = this.opciones.length;
      this.ordenarPorVotos();
      this.calcularWidth();
    });
  }

  ngOnDestroy() {
    this.destroy = true;
    this.sub.unsubscribe();
  }

  ordenarPorVotos() {
    this.opciones.sort((a: any, b: any) => {
      if (a.total_votos < b.total_votos) {
        return -1;
      } else if (a.total_votos > b.total_votos) {
        return 1;
      } else {
        return 0;
      }
    });
    this.opciones = this.opciones.reverse();
  }

  calcularWidth() {
    this.maximo = this.opciones[0].total_votos * 1.0;
    for (var opt in this.opciones) {
      var porcentaje = Math.round(((this.opciones[opt].total_votos / this.maximo) * 100) * 100) / 100;
      this.opciones[opt].width = porcentaje;
    }
  }
}
