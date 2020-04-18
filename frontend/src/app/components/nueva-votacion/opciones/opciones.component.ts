import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.css'],
})
export class OpcionesComponent implements OnInit {
  opciones = 0;
  @Input() data;

  constructor() { }

  ngOnInit(): void {
    this.calculateOpciones();
  }

  calculateOpciones() {
    this.opciones = this.data.length;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  newOption() {
    this.data.push("")
    this.calculateOpciones();
  }

  deleteOption(ind) {
    this.data.splice(ind, 1);
    this.calculateOpciones();
  }
}
