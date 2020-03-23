import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NuevaVotacionComponent } from '../nueva-votacion.component';

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
  opciones = ["Sí, deberiamos abrirla", "No, que va, no te ralles", "Pero que cojones dices?", "Tal vez es buena idea", "Consultare con tu puta madre", "Ande esta er beti"];
  //opciones: string[] = ["Sí, deberiamos abrirla jajajaj xd lol", "No, que va, no te ralles jajajaj xd lol", "Pero que cojones dices?", "No LOL"];
  participantes: string[] = ["Paco Rodriguez Garcia", "Manolo Fuentes Lopez", "Lorenzo Fernandez Miralles", "Paco Rodriguez Garcia", "Manolo Fuentes Lopez"];
  fecha: Date = new Date();
  color: string = "blue";

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  confirmVotacion() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigate(['/listadoVotaciones']);
        res();
      }, 1500);
    })
  }

  cancelVotacion() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
          this.router.navigate(['/nuevaVotacion']));
        res();
      }, 1500);
    })
  }

  redirectTo(uri:string){
    
 }
}
