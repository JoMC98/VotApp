import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NuevaVotacionComponent } from '../nueva-votacion.component';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {
  @Input() data;

  constructor(private router: Router, private controllerBD: DatabaseControllerService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  openSnackBar() {
    var message = "Se ha creado con éxito"
    var action = "Cerrar"

    let config = new MatSnackBarConfig();
    config.duration = 2000;
    config.panelClass = ['confirm-snackbar']

    this._snackBar.open(message, action, config);
  }

  confirmVotacion() {
    this.controllerBD.añadirVotacion(this.data).then((result) =>{
      this.openSnackBar()
      new Promise((res) => {
        setTimeout(() => {
          this.router.navigate(['/listadoVotaciones']);
          res();
        }, 2500);
      })
    }).catch(err => {
      console.log(err);
    });
  }

  cancelVotacion() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
          this.router.navigate(['/nuevaVotacion']));
        res();
      }, 1500);
    })
  }

  redirectTo(uri:string){
    
 }
}
