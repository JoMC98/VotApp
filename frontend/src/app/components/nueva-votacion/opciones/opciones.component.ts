import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.css'],
})
export class OpcionesComponent implements OnInit {
  opciones = 0;
  errorTypes = {options: {required: "Debes introducir al menos dos opciones"}} 

  @Input() data;

  constructor(private _snackBar: MatSnackBar) { }

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
      this.openSnackBar()
      return false;
    } else {
      return true;
    }
  }

  openSnackBar() {
    var message = "Debes introducir al menos dos opciones"
    var action = "Cerrar"

    let config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = ['alert-snackbar']

    this._snackBar.open(message, action, config);
  }

  deleteOption(ind) {
    this.data.splice(ind, 1);
    this.calculateOpciones();
  }
}
