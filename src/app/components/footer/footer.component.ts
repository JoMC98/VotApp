import { Component, OnInit} from '@angular/core';
import { ListadoVotacionesComponent } from '../listado-votaciones/listado-votaciones.component';
import { NuevaVotacionComponent } from '../nueva-votacion/nueva-votacion.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  admin: boolean = true;
  options: number[] = (this.admin ? [0,1,2,3,4] : [0,6,1,6,4]);
  dni: string = "12345678X"
  pages= {0:'home', 1:'listadoVotaciones', 2: 'nuevaVotacion', 3: 'users'};
  page: number = 0;

  constructor() {
  }

  ngOnInit(): void {
  }

  alterna() {
    this.admin = !this.admin;
    this.options = (this.admin ? [0,1,2,3,4] : [0,6,1,6,4]);
    this.page = 0;
  }
}
