import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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

  pregunta: string = "¿Deberiamos abrir una nueva sucursal en Valencia?";

  options = [];
  opciones = [];

  resultados: boolean = false;

  constructor(private route: ActivatedRoute, private controllerBD: DatabaseControllerService) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.codigo = +params['codigo']; 
      this.obtenerResultados();
   });
  }

  obtenerResultados() {
    this.controllerBD.obtenerResultadosVotacion(this.codigo).then((result) =>{
      if(result[0] == undefined || result[0].total_votos == null) {
        new Promise((res) => {
          setTimeout(() => {
            if (!this.destroy) {
              this.obtenerResultados()
            }
          }, 2000);
        })
      } else {
        this.resultados = true;
        for (let i of Object.keys(result)) {
          var opt = result[i];
          opt["width"] = 0;
          this.opciones.push(opt)
        }

        this.totalOpciones = this.opciones.length;
        this.ordenarPorVotos();
        this.calcularWidth();
      }
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
