import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, OnDestroy {

  id: number;
  private sub: any;

  pregunta: string = "¿Deberiamos abrir una nueva sucursal en Valencia?";
  participantes = {"12345678X": {dni:"12345678X", nombre: "Paco", apellido: "Gonzalez Lopez", departamento: "Administración", cargo:"Jefe de Abastecimiento"},
                   "12345679X": {dni:"12345679X", nombre: "Mario", apellido: "Mir Dos", departamento: "Administración", cargo:"Jefe de Suministros"},
                   "12345670X": {dni:"12345670X", nombre: "Luis", apellido: "Alvarez Lopez", departamento: "Dirección", cargo:"CEO"},
                   "12345623X": {dni:"12345623X", nombre: "Ana", apellido: "Garcia Fernandez", departamento: "Marketing", cargo:"CMO"},
                   "12345643A": {dni:"12345643A", nombre: "Juan", apellido: "Comins Garcia", departamento: "Finanzas", cargo:"Jefe de Ventas"}};

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
