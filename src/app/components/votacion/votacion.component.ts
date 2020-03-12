import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.css']
})
export class VotacionComponent implements OnInit, OnDestroy {
  id: number;
  private sub: any;

  votes = {1 : {id:1, pregunta: "¿Deberíamos abrir otra sucursal en Alicante?", estado: "Finalizada", departamento: "Administración", ambito: "Privada", fecha: new Date("2020-01-20")},
           2 : {id: 2, pregunta: "¿Deberíamos abrir otra sucursal en La Vall?", estado: "Activa", departamento: "Administración", ambito: "Oculta", fecha: new Date("2020-04-16")},
           3 : {id: 3, pregunta: "¿Deberíamos abrir otra sucursal en Barcelona?", estado: "Activa", departamento: "Dirección", ambito: "Departamento", fecha: new Date("2020-04-18")},
           4 : {id: 4, pregunta: "¿Deberíamos abrir otra sucursal en Castellon?", estado: "Activa", departamento: "Marketing", ambito: "Departamento", fecha: new Date("2020-03-8")},
           5 : {id: 5, pregunta: "¿Deberíamos abrir otra sucursal en Valencia?", estado: "Activa", departamento: "Administración", ambito: "Privada", fecha: new Date("2020-03-16")},
           6 : {id: 6, pregunta: "¿Deberíamos abrir otra sucursal en Zaragoza?", estado: "En proceso", departamento: "Administración", ambito: "Publica", fecha: new Date("2020-03-4")}, 
           7 : {id: 7, pregunta: "¿Deberíamos abrir otra sucursal en Madrid?", estado: "Finalizada", departamento: "Administración", ambito: "Pública", fecha: new Date("2020-02-18")},
           8 : {id: 8, pregunta: "¿Deberíamos abrir otra sucursal en Galicia?", estado: "Finalizada", departamento: "Finanzas", ambito: "Privada", fecha: new Date("2020-02-01")}};

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; 
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
