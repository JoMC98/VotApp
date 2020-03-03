import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resumen-user',
  templateUrl: './resumen-user.component.html',
  styleUrls: ['./resumen-user.component.css']
})
export class ResumenUserComponent implements OnInit {
  nombre: string = "Paco";
  apellidos: string = "Rodriguez Garcia";
  username: string = "paco1234";
  passwd: string = "patata";
  dni: string = "12345678X";
  tlf: number = 987234213;
  mail: string = "paco@ayuntamiento.com";
  dpto: string = "Administración";
  cargo: string = "Jefe de Abastecimiento";


  constructor() { }

  ngOnInit(): void {
  }

}
