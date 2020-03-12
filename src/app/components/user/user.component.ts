import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  dni: string;
  private sub: any;

  usuarios = {"12345678X" : {dni:"12345678X", nombre: "Paco", apellido: "Gonzalez Lopez", telefono : 666666666, correo : "paco@gmail.com",departamento: "Administración", cargo:"Jefe de Abastecimiento",fechaRegistro: new Date("2020-01-20")},
              "12345679X" : {dni:"12345679X", nombre: "Mario", apellido: "Mir Dos", telefono : 666666666, correo : "paco@gmail.com", departamento: "Administración", cargo:"Jefe de Suministros",fechaRegistro: new Date("2020-01-20")},
              "12345670X" : {dni:"12345670X", nombre: "Luis", apellido: "Alvarez Lopez", telefono : 666666666, correo : "paco@gmail.com", departamento: "Dirección", cargo:"CEO",fechaRegistro: new Date("2020-01-20")},
              "12345623X" : {dni:"12345623X", nombre: "Ana", apellido: "Garcia Fernandez", telefono : 666666666, correo : "paco@gmail.com", departamento: "Marketing", cargo:"CMO",fechaRegistro: new Date("2020-01-20")},
              "12345643A" : {dni:"12345643A", nombre: "Juan", apellido: "De los palomos Garcia", telefono : 666666666, correo : "paco@gmail.com", departamento: "Finanzas", cargo:"Jefe de Ventas",fechaRegistro: new Date("2020-01-20")},
              "12345612D" : {dni:"12345612D", nombre: "Valentina", apellido: "Del arco Alarcon", telefono : 666666666, correo : "paco@gmail.com", departamento: "Dirección", cargo:"Jefe de Comerciales",fechaRegistro: new Date("2020-01-20")},
              "13525678X" : {dni:"13525678X", nombre: "Eustaquio", apellido: "Roca Zaragoza", telefono : 666666666, correo : "paco@gmail.com", departamento: "Administración", cargo:"CTO",fechaRegistro: new Date("2020-01-20")},
              "85678678X" : {dni:"85678678X", nombre: "Paco", apellido: "Lopez Torres", telefono : 666666666, correo : "paco@gmail.com", departamento: "Marketing", cargo:"CFO",fechaRegistro: new Date("2020-01-20")},
              "96856678X" : {dni:"96856678X", nombre: "Jordi", apellido: "Villa Parejo", telefono : 666666666, correo : "paco@gmail.com", departamento: "Marketing", cargo:"Secretario General",fechaRegistro: new Date("2020-01-20")},
              "16456678X" : {dni:"16456678X", nombre: "Manolo", apellido: "Betis Balompie", telefono : 666666666, correo : "paco@gmail.com", departamento: "Finanzas", cargo:"Asesor financiero",fechaRegistro: new Date("2020-01-20")}};

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.dni = params['dni']; 
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
