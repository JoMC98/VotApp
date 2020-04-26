import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { DatosVotacionControllerService } from 'src/app/services/sockets/datos-votacion-controller.service';
import { AdminSocketControllerService } from 'src/app/services/sockets/admin-socket-controller.service';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';

@Component({
  selector: 'app-stop',
  templateUrl: './stop.component.html',
  styleUrls: ['./stop.component.css']
})
export class StopComponent implements OnInit {

  admin: boolean;
  mostrarBotones: boolean = false;

  @Input() codigo;

  constructor(private sessionController: SessionControllerService, private router: Router, 
    private socketController: AdminSocketControllerService, private controllerBD: DatabaseControllerService) {
    this.admin = sessionController.getAdminSession();
  }

  ngOnInit(): void {
    if (this.admin) {
      this.cerrarVotacion()
    }
  }

  cerrarVotacion() {
    new Promise((res) => {
      this.socketController.sendMessageDestino(null, "STOP", null);
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
