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
  options: number[] = (this.admin ? [0,1,2,3,4] : [0,6,1,6,4])
  pages= {1:'listadoVotaciones', 2: 'nuevaVotacion', 3: 'users', 4: 'nuevoUser',  5: 'passwd'}

  constructor() {
  }

  ngOnInit(): void {
  }

  change(index) {
    for (let opt of this.options) {
      if (opt == index) {
        (<HTMLImageElement>document.getElementById("icon"+opt)).src = "assets/icons/selected/" + opt + ".png";
        //document.getElementById("hr"+opt).hidden = false;
      } else if (opt != 6 ) {
        (<HTMLImageElement>document.getElementById("icon"+opt)).src = "assets/icons/" + opt + ".png";
        //document.getElementById("hr"+opt).hidden = true;
      }
    }
  }

  alterna() {
    this.admin = !this.admin;
    this.options = (this.admin ? [0,1,2,3,4] : [0,6,1,6,4]);
    this.change(1);
  }
}
