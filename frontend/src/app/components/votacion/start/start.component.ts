import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { AdminSocketControllerService } from 'src/app/services/sockets/admin-socket-controller.service';
import { DatosVotacionControllerService } from 'src/app/services/sockets/datos-votacion-controller.service';
import { CifradoControllerService } from 'src/app/services/cipher/cifrado-controller.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, OnDestroy {
  codigo: number = 0;
  private sub: any;

  portSocket;
  pregunta;
  admin;
  clavePrivada;

  lista = {};
  total;  

  classSizeTop = ""
  classSizeBottom = ""
  classSizeNormal = "userStart"
  campanas = {}

  progress = 0;
  completed = 0;
  canStart: boolean = false;
  waiting: boolean = false;
  alteracion: boolean = false;
  error: boolean = false;
  stop: boolean = false;

  interval = null;
  interval2 = null;
  clicked = false;

  constructor(private route: ActivatedRoute, private controllerBD: DatabaseControllerService, private sessionController: SessionControllerService, 
    private router: Router, private socketController: AdminSocketControllerService, private controllerVotacion: DatosVotacionControllerService,
    private cifradoController: CifradoControllerService) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.codigo = +params['codigo']; 
      this.admin = this.sessionController.getAdminSession();
      if (this.admin) {
        this.startVotacion()
      } else {
        this.router.navigate(['/home']);
      }
      
   });
  }

  startVotacion() {
    this.controllerBD.activarVotacion(this.codigo).then((result) =>{
      if (result["status"] && result["status"] == "Error votacion") {
        this.error = true;
        this.pregunta = result["pregunta"];
      } else {
        this.pregunta = result["pregunta"];
        this.portSocket = result["portAdmin"];
        this.clavePrivada = result["clavePrivada"]

        var token = result["token"]

        this.controllerVotacion.setCodigo(this.codigo);
        this.total = result["participantes"];
        if (this.total == 3 || this.total == 4 || this.total == 5) {
          this.classSizeTop = "userStartTop" + this.total;
          this.classSizeBottom = "userStartBottom" + this.total;
          this.classSizeNormal = "userStart" + this.total;
        }
        this.controllerBD.obtenerParticipantesVotacion(this.codigo).then((res) => {
          for (var k of Object.keys(res)) {
            this.lista[res[k].dni] = false;
          }
          this.generateCampanas();
          this.abrirSocketAdmin(token);
        })
      }
    });
  }

  generateCampanas() {
    for (var k of Object.keys(this.lista)) {
      this.campanas[k] = "";
    }
  }

  abrirSocketAdmin(token) {
    this.socketController.createSocketAdmin(this.portSocket, token);
    this.comprobarEstado();
  }

  comprobarEstado() {
    this.interval = setInterval(() => {
      var status = this.controllerVotacion.getStatus()
      this.progress = status.progress;
      this.completed = status.completed.length;

      for (var dni of status.completed) {
        this.lista[dni] = true;
      }

      var hasResults = this.controllerVotacion.getHasResults();
      if (hasResults.error) {
        this.error = true;
        clearInterval(this.interval)
      }
    }, 3000)
  }

  stopVotacion() {
    this.cerrarVotacion()
  }

  cerrarVotacion() {
    this.stop = true;
    this.waiting = false;
    if (this.interval != null) {
      clearInterval(this.interval)
    }
    if (this.interval2 != null) {
      clearInterval(this.interval2)
    }
  }

  start() {
    this.cifradoController.crearCifradoresAdmin("patata", this.clavePrivada)
    this.socketController.sendMessage({fase: "A3", data: "OK"});
    this.clicked = true;
    new Promise((res) => {
      setTimeout(() => {
        this.waiting = true;
        this.gestionarVotacion();
      }, 2000);
    })
  }

  gestionarVotacion() {
    clearInterval(this.interval)
    this.interval = null;

    this.interval2 = setInterval(() => {
      var hasResults = this.controllerVotacion.getHasResults();
      if (hasResults.result) {
        clearInterval(this.interval2)
        this.interval2 = null;
        this.router.navigate(['/resultados', this.codigo]);
      } else if (hasResults.alteracion) {
        this.alteracion = true;
        this.waiting = false;
        clearInterval(this.interval2)
        this.interval2 = null;
      } else if (hasResults.error) {
        this.error = true;
        this.waiting = false;
        clearInterval(this.interval2)
        this.interval2 = null;
      }
    }, 1000)
  }
  
  notificar(dni) {
    this.campanas[dni] = "activarCampanaStart";
    this.socketController.sendMessageDestino(null, "PUSH", {dni: dni});
    setTimeout(() => {
      this.campanas[dni] = "ocultarCampanaStart";
      setTimeout(() => {
        this.campanas[dni] = "aparecerCampanaStart";
        setTimeout(() => {
          this.campanas[dni] = "";
        }, 2000)
      }, 30000)
    }, 1500)
  }

  ngOnDestroy() {
    //this.sub.unsubscribe();
  }
}
