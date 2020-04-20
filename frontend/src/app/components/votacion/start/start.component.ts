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

  participantes;
  portSocket;
  pregunta;
  admin;
  clavePrivada;

  progress = 0;
  total;
  completed = [];
  canStart: boolean = false;
  waiting: boolean = false;
  alteracion: boolean = false;
  error: boolean = false;

  interval = null;

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
      this.pregunta = result["pregunta"];
      this.portSocket = result["portAdmin"];
      this.clavePrivada = result["clavePrivada"]
      this.controllerVotacion.setCodigo(this.codigo);
      // this.participantes = result["participantes"];
      this.abrirSocketAdmin();
    });
  }

  abrirSocketAdmin() {
    this.socketController.createSocketAdmin(this.portSocket, "AAA");
    this.comprobarEstado();
  }

  comprobarEstado() {
    this.interval = setInterval(() => {
      var status = this.controllerVotacion.getStatus()
      this.progress = status.progress;
      this.completed = status.completed;
      this.total = status.total;
      var hasResults = this.controllerVotacion.getHasResults();
      if (hasResults.error) {
        this.error = true;
        clearInterval(this.interval)
      } else if (this.progress == 100) {
        this.canStart = true;
      }
    }, 3000)
  }

  start() {
    this.cifradoController.crearCifradoresAdmin(this.clavePrivada)
    this.socketController.sendMessage({fase: "A3", data: "OK"});
    new Promise((res) => {
      setTimeout(() => {
        this.waiting = true;
        this.gestionarVotacion();
      }, 2000);
    })
  }

  gestionarVotacion() {
    clearInterval(this.interval)
    var intervalo = setInterval(() => {
      var hasResults = this.controllerVotacion.getHasResults();
      if (hasResults.result) {
        clearInterval(intervalo)
        this.router.navigate(['/resultados', this.codigo]);
      } else if (hasResults.alteracion) {
        this.alteracion = true;
        this.waiting = false;
        clearInterval(intervalo)
      } else if (hasResults.error) {
        this.error = true;
        this.waiting = false;
        clearInterval(intervalo)
      }
    }, 1000)
  }

  ngOnDestroy() {
    //this.sub.unsubscribe();
  }
}
