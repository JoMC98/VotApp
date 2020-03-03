import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {
  pregunta: string = "¿Deberiamos abrir una nueva sucursal en Valencia?"
  dpto: string = "Marketing";
  ambito: string = "Privada";
  ambitoDescripcion = {"none": "", "Publica": "La votación será visible para todos", 
  "Departamento": "La votación será visible por miembros del departamento", 
  "Privada": "La votación solo será visible para los participantes", 
  "Oculta": "La votación no será visible para nadie"};
  //opciones: string[] = ["Sí", "No"];
  //opciones: string[] = ["Sí, deberiamos abrirla ", "No, que va, no te ralles"];
  //opciones: string[] = ["Sí, deberiamos abrirla jajajaj xd lol", "No, que va, no te ralles jajajaj xd lol", "Pero que cojones dices?"];
  opciones: string[] = ["Sí, deberiamos abrirla jajajaj xd lol", "No, que va, no te ralles jajajaj xd lol", "Pero que cojones dices?", "No LOL"];
  participantes: string[] = ["Paco Rodriguez Garcia", "Manolo Fuentes Lopez", "Lorenzo Fernandez Miralles", "Paco Rodriguez Garcia", "Manolo Fuentes Lopez"];
  fecha: Date = new Date();
  color: string = "blue";

  constructor() { }

  ngOnInit(): void {
  }

}
