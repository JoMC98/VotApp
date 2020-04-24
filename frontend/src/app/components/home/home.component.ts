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

  votaciones = [];

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
      for (let i of Object.keys(result)) {
        this.votaciones.push(result[i])
      }
    });
  }

  ngOnInit(): void {
  }

}
