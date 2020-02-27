import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.css']
})
export class OpcionesComponent implements OnInit {
  opciones: number = 2;

  constructor() { }

  ngOnInit(): void {
  }

  newOption() {
    this.opciones += 1;
  }

  deleteOption(ind) {
    for (let i = ind; i<this.opciones-1; i++) {
      (<HTMLInputElement>document.getElementById("inputFormOption" + i)).value = (<HTMLInputElement>document.getElementById("inputFormOption" + (i + 1))).value;
    }
    this.opciones -= 1;
  }
}
