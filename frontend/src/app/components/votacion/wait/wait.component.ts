import { Component, OnInit } from '@angular/core';
import { DatosVotacionControllerService } from 'src/app/services/sockets/datos-votacion-controller.service';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.css']
})
export class WaitComponent implements OnInit {

  constructor(private controllerVotacion: DatosVotacionControllerService) { }

  ngOnInit(): void {
  }

}
