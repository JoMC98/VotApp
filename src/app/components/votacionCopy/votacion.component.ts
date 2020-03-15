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

  pregunta: string = "¿Deberiamos abrir una nueva sucursal en Valencia?";
  descripcion: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id fringilla mi. Duis gravida, quam ac hendrerit pharetra, ante ex commodo erat, in lacinia nibh velit eu enim. Ut vitae aliquam urna. Duis eu fringilla arcu, quis rutrum ex. Aliquam non urna lectus. In hac habitasse platea dictumst. Maecenas nec orci purus. Nulla id aliquam eros. Sed aliquet, velit ac porta posuere, dui mi egestas ex, vel pulvinar risus lectus in quam. Cras id elit porta, fermentum lacus eu, varius est. Pellentesque ultricies efficitur neque id laoreet. Donec porta rutrum odio et iaculis. Pellentesque sed tortor ornare, pharetra libero eget, dictum sapien. Morbi lorem velit, porta sit amet justo id, tincidunt porttitor ligula.";
  // departamento: string = "Finanzas";
  // departamento: string = "Marketing";
  departamento: string = "Administración";
  // departamento: string = "Direccion";

  estado: string = "Activa";

  // ambito: string = "Departamento";
  ambito: string = "Publica";
  // ambito: string = "Privada";
  // ambito: string = "Oculta";

  //opciones: string[] = ["Sí", "No"];
  //opciones: string[] = ["Sí, deberiamos abrirla ", "No, que va, no te ralles"];
  opciones: string[] = ["Sí, deberiamos abrirla jajajaj xd lol", "No, que va, no te ralles jajajaj xd lol", "Pero que cojones dices?", "A", "B", "C"];
  //opciones: string[] = ["Sí, deberiamos abrirla jajajaj xd lol", "No, que va, no te ralles jajajaj xd lol", "Pero que cojones dices?", "No LOL"];
  participantes = [{dni:"12345678X", nombre: "Paco", apellido: "Gonzalez Lopez", departamento: "Administración", cargo:"Jefe de Abastecimiento"},
                   {dni:"12345679X", nombre: "Mario", apellido: "Mir Dos", departamento: "Administración", cargo:"Jefe de Suministros"},
                   {dni:"12345670X", nombre: "Luis", apellido: "Alvarez Lopez", departamento: "Dirección", cargo:"CEO"},
                   {dni:"12345623X", nombre: "Ana", apellido: "Garcia Fernandez", departamento: "Marketing", cargo:"CMO"},
                   {dni:"12345643A", nombre: "Juan", apellido: "De los palomos Garcia", departamento: "Finanzas", cargo:"Jefe de Ventas"}];
  fecha: Date = new Date();

  opcion: number = 0;
  participante: number = 0;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; 
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  prevOpcion() {
    this.opcion -= 1;
    if (this.opcion == -1) {
      this.opcion = this.opciones.length - 1;
    }
  }

  nextOpcion() {
    this.opcion += 1;
    if (this.opcion == this.opciones.length) {
      this.opcion = 0;
    }
  }

  prevParticipante() {
    this.participante -= 1;
    if (this.participante == -1) {
      this.participante = this.participantes.length - 1;
    }
  }

  nextParticipante() {
    this.participante += 1;
    if (this.participante == this.participantes.length) {
      this.participante = 0;
    }
  }

}
