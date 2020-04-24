import { Component, OnInit, Input } from '@angular/core';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  admin: boolean;
  mostrarBotones: boolean = false;

  @Input() codigo;

  constructor(private sessionController: SessionControllerService, private router: Router, private controllerBD: DatabaseControllerService) {
    this.admin = sessionController.getAdminSession();
  }

  ngOnInit(): void {
    if (this.admin) {
      this.cerrarVotacion()
    }
  }

  cerrarVotacion() {
    new Promise((res) => {
      setTimeout(() => {
        this.controllerBD.cerrarVotacionError(this.codigo).then((res) =>{
          if (res['status'] == 'ok') {
            this.mostrarBotones = true;
          }
        })
      }, 1500);
    });
  }

  reiniciarVotacion() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
          this.router.navigate(['/iniciarVotacion', this.codigo]));
      }, 1000);
    })
    
  }

  back() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigate(['/votacion', this.codigo],{ queryParams: {home: false} });
        res();
      }, 1000);
    })
  }

  restart() {
    this.reiniciarVotacion();
    
  }

}
