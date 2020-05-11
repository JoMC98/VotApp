import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';
import { VotanteSocketControllerService } from 'src/app/services/sockets/votante-socket-controller.service';
import { DatosVotacionControllerService } from 'src/app/services/sockets/datos-votacion-controller.service';
import { CifradoControllerService } from 'src/app/services/cipher/cifrado-controller.service';
import { SenderMessageControllerService } from 'src/app/services/sockets/sender-message-controller.service';

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
  canVote: boolean = false;
  waiting: boolean = false;
  alteracion: boolean = false;
  error: boolean = false;
  stop: boolean = false;

  portSocket;
  clavePrivada;
  desencryptedKey: boolean = false;

  interval = null;

  password: boolean = true;
  interval2 = null;
  interval3 = null;
  interval4 = null;
  timeout = null;

  activarBoton: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, 
    private controllerBD: DatabaseControllerService, private sessionController: SessionControllerService, 
    private socketController: VotanteSocketControllerService, private controllerVotacion: DatosVotacionControllerService,
    private cifradoController: CifradoControllerService) { 
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
          if (this.isLogged()) {
            this.continueVotacion()
          } else {
            this.pedirSocketVotacion();
          }
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

  isLogged() {
    var logged = this.controllerVotacion.isLogged()
    return logged
  }

  continueVotacion() {
    this.controllerBD.obtenerDatosVotacion(this.codigo).then(datos => {
      this.password = false;
      this.pregunta = datos["pregunta"];
      this.waiting = this.controllerVotacion.getVoted();

      if (this.waiting) {
        this.gestionarVotacion()
      } else {
        this.comprobarEstado()
      }
    })
  }

  clearIntervals() {
    clearInterval(this.interval)
    clearInterval(this.interval2)
    clearInterval(this.interval3)
    clearInterval(this.interval4)
  }

  ngOnDestroy() {
    clearTimeout(this.timeout)
    this.clearIntervals()
    this.sub.unsubscribe();
  }

  pedirSocketVotacion() {
    this.checkOpen().then(res => {
      if (res) {
        this.controllerBD.obtenerDatosVotacion(this.codigo).then(datos => {
          this.portSocket = datos["socketPort"];
          this.clavePrivada = datos["clavePrivada"];
          this.pregunta = datos["pregunta"];
          var token = datos["token"]
          this.controllerVotacion.setEncryptedPrivateKey(this.clavePrivada)
          this.checkLogin().then(() => {
            this.abrirSocketVotante(token);
          }).catch((err) => {
            this.controllerVotacion.clearData()
            if (!err) {
              this.router.navigate(['/votacion', this.codigo],{ queryParams: {home: false} });
            }
          })
        })
      }
    })
  }

  back() {
    clearTimeout(this.timeout)
    this.clearIntervals()
    this.router.navigate(['/votacion', this.codigo],{ queryParams: {home: false} });
  }

  async checkOpen() {
    return await new Promise((resolve, reject) => {
      this.controllerBD.obtenerEstadoVotacionVotante(this.codigo).then(state => {
        this.pregunta = state["pregunta"];
        var error = state["error"];

        if (state["estado"] == "Creada") {
          if (error == null) {
            this.router.navigate(['/restrictedAccess'])
            resolve(false);
          } else {
            if (error == "ERR") {
              this.password = false;
              this.error = true;
    
              this.clearIntervals()
              resolve(false);
            } else {
              this.password = false;
              this.stop = true;
    
              this.clearIntervals()
              resolve(false);
            }
          }
        } else if (state["estado"] == "Finalizada") {
          this.clearIntervals()
          this.router.navigate(['/restrictedAccess'])
          resolve(false);
        } else {
          resolve(true)
        }
      })
    })
  }

  async checkLogin() {
    return await new Promise((resolve, reject) => {
      this.timeout = setTimeout(() => {
        clearInterval(this.interval2)
        clearInterval(this.interval3)
        reject(false)
      }, 30000);

      this.interval2 = setInterval(() => {
        var logged = this.controllerVotacion.isLogged()
        if (logged) {
          this.password = false;
          clearTimeout(this.timeout)
          clearInterval(this.interval2)
          clearInterval(this.interval3)
          resolve(true)
        }
      }, 1000);

      this.interval3 = setInterval(() => {
        this.checkOpen().then(res => {
          if (!res) {
            reject(true)
          }
        })
      }, 2000);
    })
  }

  abrirSocketVotante(token) {
    this.socketController.createSocketVotante(this.portSocket, token);
    this.comprobarEstado();
  }

  comprobarEstado() {
    this.comprobacionEstado()
    this.interval = setInterval(() => {
      this.comprobacionEstado()
    }, 3000)
  }

  comprobacionEstado() {
    this.canVote = this.controllerVotacion.getCanVote()
    if (this.canVote && !this.desencryptedKey) {
      this.cifradoController.crearCifradoresVotante()
      this.desencryptedKey = true;
    }
    var hasResults = this.controllerVotacion.getHasResults();
    if (hasResults.error) {
      this.error = true;
      clearInterval(this.interval)
    }
    else if (hasResults.stop) {
      this.stop = true;
      clearInterval(this.interval)
    }
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

  votar() {
    if (this.selected) {
      this.activarBoton = true;

      var seleccion = this.seleccion
  
      for (var i in this.options) {
        this.options[i]["selected"] = "";
      }
      this.selected = false;
      this.seleccion = null;
  
      this.cifradoController.cifrarVoto(this.options[seleccion].pregunta).then(res => {
        var ip = this.controllerVotacion.getIp(0);
        this.socketController.sendMessageDestino(ip, 1, res)
       
        new Promise((res) => {
            setTimeout(() => {
              this.waiting = true;
              this.controllerVotacion.activateVoted()
              this.gestionarVotacion();
            }, 2000);
          })
      })
    }
  }

  gestionarVotacion() {
    this.comprobacionGestionVotacion()
    clearInterval(this.interval)
    this.interval4 = setInterval(() => {
      this.comprobacionGestionVotacion()
    }, 1000)
  }

  comprobacionGestionVotacion() {
    var hasResults = this.controllerVotacion.getHasResults();
    if (hasResults.result) {
      clearInterval(this.interval4)
      this.router.navigate(['/resultados', this.codigo]);
    } else if (hasResults.alteracion) {
      this.alteracion = true;
      this.waiting = false;
      clearInterval(this.interval4)
    } else if (hasResults.error) {
      this.error = true;
      this.waiting = false;
      clearInterval(this.interval4)
    } else if (hasResults.stop) {
      this.stop = true;
      this.waiting = false;
      clearInterval(this.interval4)
    }
  }
}
