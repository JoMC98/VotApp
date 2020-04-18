import { Component, OnInit } from '@angular/core';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  nombre: string;
  admin: boolean;

  votaciones = [];

  constructor(private controllerBD: DatabaseControllerService, private sessionController: SessionControllerService) {
    this.admin = sessionController.getAdminSession();
    this.nombre = sessionController.getNombreSession();
    this.getVotaciones();
  }

  getVotaciones() {
    this.votaciones = []

    this.controllerBD.obtenerHomeVotaciones().then((result) =>{
      for (let i of Object.keys(result)) {
        this.votaciones.push(result[i])
      }
    });
  }

  ngOnInit(): void {
  }

}
