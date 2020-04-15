import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { VotanteSocketControllerService } from 'src/app/services/sockets/votante-socket-controller.service';

@Component({
  selector: 'app-votar',
  templateUrl: './votar.component.html',
  styleUrls: ['./votar.component.css']
})
export class VotarComponent implements OnInit, OnDestroy {
  codigo: number;
  dni: number;
  private sub: any;

  pregunta: string;
  
  opciones = [];

  seleccion = null;
  selected = false;
  options = [];
  total: number = 0;
  row2: boolean = false;
  card: string = "";
  center = [];

  portSocket;
  clavePrivada;

  activarBoton: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private controllerBD: DatabaseControllerService, private sessionController: SessionControllerService, 
    private socketController: VotanteSocketControllerService) { 
  }

  generateOptions() {
    this.total = this.opciones.length;
    this.row2 = this.total < 3 ? true : false;
    this.options = [];

    if (this.total < 5) {
      this.card = "card2filas";
    } else if (this.total < 7) {
      this.card = "card3filas";
    } else {
      this.card = "card4filas";
    }

    var i = 0;
    for (var op of this.opciones) {
      var dict = {};
      dict["pregunta"] = op;
      dict["color"] = "cardColorOpcion" + i;
      dict["card"] = this.card;
      dict["cardZona"] = "";
      dict["selected"] = "";

      if (this.total == 2) {
        dict["card"] = this.card + "CenterVertical";
      }
      else if (this.total == 3 && (i == 2)) {
        dict["card"] = this.card + "Center";
      } else if (this.total == 5 && (i == 2)) {
        dict["card"] = this.card + "Center";
      } 

      if ((this.total == 3 || this.total == 4) && (i < 2)) {
        dict["cardZona"] = "card2filasArriba";
      } else if ((this.total == 3 || this.total == 4) && (i > 1)) {
        dict["cardZona"] = "card2filasAbajo";
      }

      this.options.push(dict);
      i++;
    }
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.codigo = +params['codigo']; 
      this.controllerBD.obtenerParticipantesVotacion(this.codigo).then((result) =>{
        var dni = this.sessionController.getDNISession();
        var part = Object.keys(result).map(p => result[p].dni)
        if (!part.includes(dni)) {
          this.router.navigate(['/home']);
        } else {
          this.pedirSocketVotacion();
        }
      })
      this.controllerBD.obtenerOpcionesVotacion(this.codigo).then((result) =>{
        this.opciones = [];
        for (let i of Object.keys(result)) {
          this.opciones.push(result[i].opcion)
        }
        this.generateOptions();
      });
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  pedirSocketVotacion() {
    this.controllerBD.obtenerDatosVotacion(this.codigo).then(datos => {
      this.portSocket = datos["socketPort"];
      this.clavePrivada = datos["clavePrivada"];
      this.pregunta = datos["pregunta"];
      this.abrirSocketVotante();
    })
  }

  abrirSocketVotante() {
    this.socketController.createSocketVotante(this.portSocket, "AAA");
  }

  select(codigo) {
    for (var i in this.options) {
      this.options[i]["selected"] = "";
    }
    if (this.selected && codigo == this.seleccion) {
      this.selected = false;
      this.seleccion = null;
    } else {
      this.selected = true;
      this.seleccion = codigo;
      this.options[codigo]["selected"] = "cardFilasSelected";
    }
  }

  rutar() {
    this.activarBoton = true
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigate(['/resultados', this.codigo]);
        res();
      }, 3000);
    })
  }
}
