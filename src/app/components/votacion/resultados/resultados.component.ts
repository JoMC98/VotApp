import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit, OnDestroy {

  id: number;
  private sub: any;

  totalParticipantes: number = 7;
  totalOpciones: number = 0;
  maximo: number = 0;

  pregunta: string = "¿Deberiamos abrir una nueva sucursal en Valencia?";

  options = [];

  opciones = [];
  opt = 0;

  resultados: boolean = true;

  constructor(private route: ActivatedRoute) {
    this.options = [
                  [{pregunta : "Sí, deberiamos abrirla", total: 1, width: 0},
                    {pregunta : "No, que va, no te ralles", total: 2, width: 0},
                    {pregunta : "Pero que cojones dices?", total: 0, width: 0},
                    {pregunta : "Tal vez es buena idea", total: 1, width: 0},
                    {pregunta : "Consultare con tu puta madre", total: 3, width: 0},
                    {pregunta : "Ande esta er beti", total: 0, width: 0}],
                  
                  [{pregunta : "Sí, deberiamos abrirla", total: 1, width: 0},
                    {pregunta : "No, que va, no te ralles", total: 2, width: 0},
                    {pregunta : "Tal vez es buena idea", total: 1, width: 0},
                    {pregunta : "Consultare con tu puta madre", total: 3, width: 0},
                    {pregunta : "Ande esta er beti", total: 0, width: 0}],

                  [{pregunta : "Sí, deberiamos abrirla", total: 2, width: 0},
                    {pregunta : "No, que va, no te ralles", total: 1, width: 0},
                    {pregunta : "Consultare con tu puta madre", total: 3, width: 0},
                    {pregunta : "Ande esta er beti", total: 0, width: 1}],

                  [{pregunta : "No, que va, no te ralles", total: 2, width: 0},
                    {pregunta : "Tal vez es buena idea", total: 2, width: 0},
                    {pregunta : "Consultare con tu puta madre", total: 3, width: 0}],

                  [{pregunta : "Tal vez es buena idea", total: 4, width: 0},
                    {pregunta : "Consultare con tu puta madre", total: 3, width: 0}]];
    this.opciones = this.options[this.opt];
    this.totalOpciones = this.opciones.length;
    this.ordenarPorVotos();
    this.calcularWidth();
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; 
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ordenarPorVotos() {
    this.opciones.sort((a: any, b: any) => {
      if (a.total < b.total) {
        return -1;
      } else if (a.total > b.total) {
        return 1;
      } else {
        return 0;
      }
    });
    this.opciones = this.opciones.reverse();
  }

  calcularWidth() {
    this.maximo = this.opciones[0].total * 1.0;
    for (var opt in this.opciones) {
      var porcentaje = Math.round(((this.opciones[opt].total / this.maximo) * 100) * 100) / 100;
      this.opciones[opt].width = porcentaje;
    }
  }

  results() {
    this.resultados = !this.resultados;
  }

  cambiarOpciones() {
    this.opt += 1;
    if (this.opt == this.options.length) {
      this.opt = 0;
    }
    this.opciones = this.options[this.opt];
    this.totalOpciones = this.opciones.length;
    this.ordenarPorVotos();
    this.calcularWidth();
  }

}
