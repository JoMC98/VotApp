import { Component, OnInit } from '@angular/core';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  nombre: string = "Paco";
  admin: boolean = false;
  // admin: boolean = true;

  votaciones = [];

  constructor(private controllerBD: DatabaseControllerService) {
    this.getVotaciones();
  }

  getVotaciones() {
    var limit = {limit: this.admin ? 4 : 6};
    this.votaciones = []
    this.controllerBD.obtenerHomeVotaciones(limit).then((result) =>{
      for (let i of Object.keys(result)) {
        this.votaciones.push(result[i])
      }
    });
  }

  ngOnInit(): void {
  }

  change() {
    this.admin = !this.admin;
    this.getVotaciones();
  }

}
