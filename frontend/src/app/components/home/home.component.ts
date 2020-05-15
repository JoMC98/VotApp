import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  nombre: string;
  admin: boolean;
  longitud: number;

  votaciones = [];
  activas = [];

  interval;

  constructor(private controllerBD: DatabaseControllerService, private sessionController: SessionControllerService) {
    this.admin = sessionController.getAdminSession();
    this.nombre = sessionController.getNombreSession();
    
    this.loopDataQuery();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  loopDataQuery() {
    this.getVotaciones()
    this.interval = setInterval(() => {
      this.getVotaciones()
    }, 30000);
  }

  getVotaciones() {
    this.controllerBD.obtenerHomeVotaciones().then((result) =>{
      this.votaciones = []
      this.activas = []
      for (let i of Object.keys(result)) {
        var vot = result[i]
        if (vot.estado == "Activa") {
          this.activas.push(vot)
        } else {
          this.votaciones.push(vot)
        }
      }
      this.checkVotaciones()
    });
  }

  checkVotaciones() {
    if (this.activas.length > 0) {
      if(this.activas.length > 2) {
        this.activas = this.activas.slice(0, 2)
      }
      if (this.votaciones.length > 4) {
        this.votaciones = this.votaciones.slice(0, 4)
      }
    }

  }

  ngOnInit(): void {
    this.longitud = this.nombre.length
  }

}
