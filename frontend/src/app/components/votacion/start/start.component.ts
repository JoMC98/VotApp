import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { AdminSocketControllerService } from 'src/app/services/sockets/admin-socket-controller.service';
import { DatosVotacionControllerService } from 'src/app/services/sockets/datos-votacion-controller.service';
import { CifradoControllerService } from 'src/app/services/cipher/cifrado-controller.service';
import { ConsoleReporter } from 'jasmine';

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
  password: boolean = true;
  canStart: boolean = false;
  waiting: boolean = false;
  alteracion: boolean = false;
  error: boolean = false;
  stop: boolean = false;

  interval = null;
  interval2 = null;
  interval3 = null;
  timeout = null;
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
        if (this.isLogged()) {
          this.continueVotacion()
        } else {
          this.getPrivateKey()
        }
        
      } else {
        this.router.navigate(['/home']);
      }
      
   });
  }

  isLogged() {
    var logged = this.controllerVotacion.isLogged()
    return logged
  }

  continueVotacion() {
    this.controllerBD.privateKeyAdmin(this.codigo).then((result) =>{
      this.pregunta = result["pregunta"];
      this.controllerBD.obtenerParticipantesVotacion(this.codigo).then(part => {
        this.total = Object.keys(part).length
        for (var k of Object.keys(part)) {
          this.lista[part[k].dni] = false;
        }
        if (this.total == 3 || this.total == 4 || this.total == 5) {
          this.classSizeTop = "userStartTop" + this.total;
          this.classSizeBottom = "userStartBottom" + this.total;
          this.classSizeNormal = "userStart" + this.total;
        }
        this.generateCampanas();

        this.password = false;

        this.waiting = this.controllerVotacion.getCanVote()

        if (this.waiting) {
          this.gestionarVotacion()
        } else {
          this.comprobarEstado()
        }
      })
    });
    
  }

  clearIntervals() {
    clearInterval(this.interval)
    clearInterval(this.interval2)
    clearInterval(this.interval3)
  }

  ngOnDestroy() {
    clearTimeout(this.timeout)
    this.clearIntervals()
  }

  back() {
    clearTimeout(this.timeout)
    this.clearIntervals()
    this.router.navigate(['/votacion', this.codigo],{ queryParams: {home: false} });
  }

  getPrivateKey() {
    this.controllerBD.privateKeyAdmin(this.codigo).then((result) =>{
      this.clavePrivada = result["clavePrivada"]
      this.pregunta = result["pregunta"];
      var estado = result["estado"]
      var error = result["error"];


      if (estado == "Creada") {
        if (error == null) {
          this.controllerVotacion.setEncryptedPrivateKey(this.clavePrivada)
          this.checkLogin().then(() => {
            this.startVotacion()
          }).catch(() => {
            this.controllerVotacion.clearData()
            this.router.navigate(['/votacion', this.codigo],{ queryParams: {home: false} });
          })
        } else {
          if (error == "ERR") {
            this.password = false;
            this.error = true;
  
            this.clearIntervals()
          } else {
            this.password = false;
            this.stop = true;
  
            this.clearIntervals()
          }
        }
      } else if (estado == "Finalizada") {
        this.clearIntervals()
        this.router.navigate(['/restrictedAccess'])
      }
    })
  }

  async checkLogin() {
    return await new Promise((resolve, reject) => {
      this.timeout = setTimeout(() => {
        clearInterval(this.interval3)
        reject(false)
      }, 30000);

      this.interval3 = setInterval(() => {
        var logged = this.controllerVotacion.isLogged()
        if (logged) {
          this.password = false;
          clearTimeout(this.timeout)
          clearInterval(this.interval3)
          resolve(true)
        }
      }, 1000);
    })
  }


  startVotacion() {
    this.controllerBD.activarVotacion(this.codigo).then((result) =>{
      if (result["status"] && result["status"] == "Error votacion") {
        this.error = true;
      } else {
        this.portSocket = result["portAdmin"]; 
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
    this.comprobacionEstado()
    this.interval = setInterval(() => {
      this.comprobacionEstado()
    }, 3000)
  }

  comprobacionEstado() {
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
    } else if (this.progress == 100) {
      this.canStart = true;
    }
  }

  stopVotacion() {
    this.socketController.sendMessageDestino(null, "STOP", null);
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
    this.controllerVotacion.changeCanVote();
    this.cifradoController.crearCifradoresAdmin()
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
    this.comprobacionGestionVotacion()
    this.interval2 = setInterval(() => {
      this.comprobacionGestionVotacion()
    }, 1000)
  }

  comprobacionGestionVotacion() {
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
}
