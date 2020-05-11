import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { UserValidatorService } from 'src/app/services/validators/user/user-validator.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-resumen-user',
  templateUrl: './resumen-user.component.html',
  styleUrls: ['./resumen-user.component.css']
})
export class ResumenUserComponent implements OnInit {

  @Input() data;
  errors = {};

  constructor(private router: Router, private controllerBD: DatabaseControllerService, private _snackBar: MatSnackBar) { 
  }

  ngOnInit(): void {
  }

  openSnackBar(confirmed) {
    var message = ""
    if (confirmed) {
      message = "Se ha creado con éxito"
    } else {
      if (this.errors["DNI"] && this.errors["mail"]) {
        message = "El DNI y el mail ya están en uso"
      } else if (this.errors["DNI"]) {
        message = "El DNI ya está en uso"
      } else {
        message = "El mail ya está en uso"
      }
    }
    
    var action = "Cerrar"

    let config = new MatSnackBarConfig();
    config.duration = confirmed ? 2000 : 5000;
    config.panelClass = confirmed ? ['confirm-snackbar'] : ['error-snackbar']

    this._snackBar.open(message, action, config);
  }

  confirmUser() {
    var usuario = {}
    this.errors = {}
    for (var k of Object.keys(this.data.personalData)) {
      usuario[k] = this.data.personalData[k]
    }
    for (var k of Object.keys(this.data.contactData)) {
      usuario[k] = this.data.contactData[k]
    }
    this.controllerBD.añadirUsuario(usuario).then((result) =>{
      this.openSnackBar(true)
      new Promise((res) => {
        setTimeout(() => {
          this.router.navigate(['/users']);
          res();
        }, 2500);
      })
    }).catch(err => {
      if (err.code == 409) {
        if (err.dni != null) {
          this.errors["DNI"] = "duplicated"
        }
        if (err.mail != null) {
          this.errors["mail"] = "duplicated"
        }
        this.openSnackBar(false)
      }
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
