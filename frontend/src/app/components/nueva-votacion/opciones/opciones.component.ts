import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.css'],
})
export class OpcionesComponent implements OnInit {
  opciones = 0;
  errorTypes = {options: {required2: "Debes introducir al menos dos opciones"}} 

  @Input() data;
  @Input() errors;

  constructor() { }

  removeError(att) {
    delete this.errors[att];
  }

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
    if (this.opciones < 6) {
      if (this.check2Options()) {
        this.data.push("")
        this.calculateOpciones();
      }
    }
  }

  check2Options() {
    if (this.data[0] == "" || this.data[1] == "") {
      this.errors["options"] = "required2";
      return false;
    } else {
      return true;
    }
  }

  deleteOption(ind) {
    this.data.splice(ind, 1);
    this.calculateOpciones();
  }
}
