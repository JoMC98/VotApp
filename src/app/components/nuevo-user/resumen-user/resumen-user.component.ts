import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  confirmUser() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigate(['/users']);
        res();
      }, 1500);
    })
  }

  cancelUser() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigate(['/users']);
        res();
      }, 1500);
    })
  }

}
