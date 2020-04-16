import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { AdminSocketControllerService } from 'src/app/services/sockets/admin-socket-controller.service';
import { DatosVotacionControllerService } from 'src/app/services/sockets/datos-votacion-controller.service';

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

  constructor(private route: ActivatedRoute, private controllerBD: DatabaseControllerService, private sessionController: SessionControllerService, 
    private router: Router, private socketController: AdminSocketControllerService, private controllerVotacion: DatosVotacionControllerService) {
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
      // this.participantes = result["participantes"];
      this.abrirSocketAdmin();
    });
  }

  abrirSocketAdmin() {
    this.socketController.createSocketAdmin(this.portSocket, "AAA");
    this.comprobarEstado();
  }

  comprobarEstado() {
    var interval = setInterval(() => {
      var status = this.controllerVotacion.getStatus()
      this.progress = status.progress;
      this.completed = status.completed;
      this.total = status.total;
      console.log(this.progress)
      if (this.progress == 100) {
        this.canStart = true;
        clearInterval(interval)
      }
    }, 3000)
  }

  start() {
    this.socketController.sendMessage({fase: "A3", data: "OK"});
  }

  ngOnDestroy() {
    //this.sub.unsubscribe();
  }
}
