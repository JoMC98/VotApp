import { Injectable } from '@angular/core';
import { DatosVotacionControllerService } from './datos-votacion-controller.service';
import { VotanteSocketControllerService } from './votante-socket-controller.service';
import { CifradoControllerService } from '../cipher/cifrado-controller.service';
import { DatabaseControllerService } from '../database/database-controller.service';

@Injectable({
  providedIn: 'root'
})
export class SenderMessageControllerService {

  constructor(private controllerVotacion: DatosVotacionControllerService, private cifradoController: CifradoControllerService, 
    private controllerBD: DatabaseControllerService) {}
  
  clearData() {
    this.controllerVotacion.clearData();
    this.cifradoController.clearData();
  }

  async controlFaseFirstPart(list): Promise<Array<Object>> {
    return await new Promise((resolve, reject) => {
      this.cifradoController.descifrarListaVotosFirstPart(list)
        .then(res => {
          var order = parseInt(this.controllerVotacion.getOrder())
          var participants = this.controllerVotacion.getParticipants()

          //Si somos el último, enviamos fase 3 a 0; sino, enviamos fase 2 al siguiente
          var fase = order + 1 == participants ? 3 : 2;
          var next = order + 1 == participants ? 0 : order + 1;

          var ip = this.controllerVotacion.getIp(next);

          resolve([{ip: ip, fase: fase, data: res}]);
        })
        .catch(err => {
          reject("Alteracion")
        })
    })
  }

  async controlFaseSecondPart(list, firstVotante) {
    return await new Promise((resolve, reject) => {
      this.cifradoController.checkSignature(list, firstVotante).then(lista => {
        this.cifradoController.descifrarListaVotosSecondPart(lista)
          .then(res => {
            var order = parseInt(this.controllerVotacion.getOrder())
            var participants = this.controllerVotacion.getParticipants()

            var last = order + 1 == participants ? true : false;
            var data = []

            //Si somos el último, enviamos fase FA a todos para que comprueben y X a admin para que descifre el ultimo
            if (last) {
              for (var i = 0; i<participants; i++) {
                var ip = this.controllerVotacion.getIp(i);
                data.push({ip: ip, fase: "FA", data: res})
              }
              data.push({ip: "admin", fase: "X", data: res})
            } 
            //Si no somos el último, enviamos fase 4 al siguiente y fase F al resto para que comprueben
            else {
              for (var i = 0; i<participants; i++) {
                if (i != order) {
                  var ip = this.controllerVotacion.getIp(i);
                  var fase = i == order + 1 ? 4 : "F";
                  data.push({ip: ip, fase: fase, data: res})
                }
              }
            }

            resolve(data);
          })
          .catch(err => {
            reject("Alteracion")
          })
        })
        .catch(err => {
          reject("Alteracion")
        })
      })
  }

  async controlCheckSign(list, admin) {
    return await new Promise((resolve, reject) => {
      this.cifradoController.checkSignature(list, false).then(lista => {
        var id = admin ? "admin" : parseInt(list.origen) + 1;
        this.cifradoController.checkEncryptedPresent(lista, id).then(() => {
          resolve(false);
        }).catch(err => {
          reject("Alteracion")
        })
      }).catch(err => {
        reject("Alteracion")
      })
    })
  }

  async controlLastString(list) {
    return await new Promise((resolve, reject) => {
      this.cifradoController.checkLastString(list).then(() => {
        var res = [{ip: "admin", fase: "Z", data: "OK VOTE"}]
        resolve(res)
      }).catch(err => {
        reject("Alteracion")
      })
    })
  }

  async controlDesencriptadoAdmin(list) {
    return await new Promise((resolve, reject) => {
      this.cifradoController.checkSignature(list, false).then(lista => {
        this.cifradoController.descifrarListaVotosAdminPart(lista).then(async res => {
          var str = JSON.stringify(res)

          let cifrados = await this.cifradoController.cifrarListaVotosAdmin(str);
          let vots = this.guardarVotos(res)
          
          cifrados.push({ip: "server", fase: "Y" , data: vots})
          resolve(cifrados)
        }).catch(err => {
          reject("Alteracion")
        })
      }).catch(err => {
        reject("Alteracion")
      })
    })
  }

  guardarVotos(res) {
    var vots = []
    for (var vote of res.datos) {
      var v = vote.split("###")[0];
      vots.push(v)
    }
    return vots  
  }
}