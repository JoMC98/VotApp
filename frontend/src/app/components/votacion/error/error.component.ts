import { Component, OnInit, Input } from '@angular/core';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { DatosVotacionControllerService } from 'src/app/services/sockets/datos-votacion-controller.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

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
