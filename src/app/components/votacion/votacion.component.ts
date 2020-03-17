import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { DesplegableVotacionComponent } from './desplegable-votacion/desplegable-votacion.component';

@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.css']
})
export class VotacionComponent implements OnInit, OnDestroy {
  dni: string = "12345678X";
  // dni: string = "96856678X";
  id: number;

  admin: boolean = true;
  // admin: boolean = false;

  objectKeys = Object.keys;

  private sub: any;

  pregunta: string = "¿Deberiamos abrir una nueva sucursal en Valencia?";
  modificarPregunta: boolean = false;
  copyPregunta: string = "";
  
  descripcion = {"descripcion": 
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id fringilla mi. Duis gravida, quam ac hendrerit pharetra, ante ex commodo erat, in lacinia nibh velit eu enim. Ut vitae aliquam urna. Duis eu fringilla arcu, quis rutrum ex. Aliquam non urna lectus. In hac habitasse platea dictumst. Maecenas nec orci purus. Nulla id aliquam eros. Sed aliquet, velit ac porta posuere, dui mi egestas ex, vel pulvinar risus lectus in quam. Cras id elit porta, fermentum lacus eu, varius est. Pellentesque ultricies efficitur neque id laoreet. Donec porta rutrum odio et iaculis. Pellentesque sed tortor ornare, pharetra libero eget, dictum sapien. Morbi lorem velit, porta sit amet justo id, tincidunt porttitor ligula. "
  };

  departamento = {"departamento": "Finanzas"}; 
  // departamento = {"departamento": "Marketing"}; 
  // departamento = {"departamento": "Administración"};
  // departamento = {"departamento": "Dirección"};

  // estado: string = "Creada";
  // estado: string = "Activa";
  estados = ["Creada", "Activa", "Finalizada"]
  st = 0;
  estado: string = "Creada";

  //  ambito = {"ambito": "Departamento"}; 
  //  ambito = {"ambito": "Pública"}; 
  ambito = {"ambito": "Privada"}; 
  //  ambito = {"ambito": "Oculta"}; 

  //opciones: string[] = ["Sí", "No"];
  //opciones: string[] = ["Sí, deberiamos abrirla ", "No, que va, no te ralles"];
  opciones = ["Sí, deberiamos abrirla jajajaj xd lol", "No, que va, no te ralles jajajaj xd lol te ralles jajajaj xd lol", "Pero que cojones dices?", "A", "B", "C"];

  //opciones: string[] = ["Sí, deberiamos abrirla jajajaj xd lol", "No, que va, no te ralles jajajaj xd lol", "Pero que cojones dices?", "No LOL"];
  participantes = {"12345678X": {dni:"12345678X", nombre: "Paco", apellido: "Gonzalez Lopez", departamento: "Administración", cargo:"Jefe de Abastecimiento"},
                   "12345679X": {dni:"12345679X", nombre: "Mario", apellido: "Mir Dos", departamento: "Administración", cargo:"Jefe de Suministros"},
                   "12345670X": {dni:"12345670X", nombre: "Luis", apellido: "Alvarez Lopez", departamento: "Dirección", cargo:"CEO"},
                   "12345623X": {dni:"12345623X", nombre: "Ana", apellido: "Garcia Fernandez", departamento: "Marketing", cargo:"CMO"},
                   "12345643A": {dni:"12345643A", nombre: "Juan", apellido: "Comins Garcia", departamento: "Finanzas", cargo:"Jefe de Ventas"}};

  fecha = {"fecha": new Date()}; 

  opcion: number = 0;
  participante: number = 0;

  constructor(private route: ActivatedRoute, private _bottomSheet: MatBottomSheet, private router: Router) { }

  rutar() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigate(['/votar', this.id]);
        res();
      }, 400);
    })
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; 
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // cambiaEstado() {
  //   this.st += 1;
  //   if (this.st == 3) {
  //     this.st = 0;
  //   }
  //   this.estado = this.estados[this.st];
  // }

  modifyPregunta() {
    this.modificarPregunta = !this.modificarPregunta;
    this.copyPregunta = this.pregunta;
  }

  guardarPregunta() {
    this.modificarPregunta = !this.modificarPregunta;
    this.pregunta = this.copyPregunta;
  }

  cancelarPregunta() {
    this.modificarPregunta = !this.modificarPregunta;
  }

  openDialog(page) {
    var datos = {page: page};
    switch (page) {
      case "descripcion":
      case "editarDescripcion":
        datos["descripcion"] = this.descripcion
        break;
      case "opciones":
      case "editarOpciones":
      case "resultados":
        datos["opciones"] = this.opciones 
        break;
      case "participantes":
      case "editarParticipantes":
        datos["participantes"] = this.participantes
        break;
      case "editarAmbito":
        datos["ambito"] = this.ambito
        break;
      case "editarDepartamento":
        datos["departamento"] = this.departamento
        break;
      case "editarFecha":
        datos["fecha"] = this.fecha
        break;
    }
    const filterRef = this._bottomSheet.open(DesplegableVotacionComponent, 
      {data: datos});

    filterRef.afterDismissed().subscribe(result => {
    })
  }

}
