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

  constructor(private sessionController: SessionControllerService, private router: Router, private controllerBD: DatabaseControllerService, private controllerVotacion: DatosVotacionControllerService) {
    this.admin = sessionController.getAdminSession();
  }

  ngOnInit(): void {
    this.controllerVotacion.clearResults();
    setTimeout(() => {
      this.mostrarBotones = true;
    }, 3000);
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
