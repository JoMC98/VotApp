import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { DatosVotacionControllerService } from '../sockets/datos-votacion-controller.service';
import { AESCipherService } from './aes-cipher.service';
import { RSACipherService } from './rsa-cipher.service';
import { KeyGeneratorService } from './key-generator.service';

@Injectable({
  providedIn: 'root'
})
export class CifradoControllerService {

  lista;
  order;
  adminCPublica;
  store = {};

  constructor(private controllerVotacion: DatosVotacionControllerService, 
    private AESCipher:AESCipherService, private RSACipher:RSACipherService, private KeyGenerator: KeyGeneratorService) { }

  clearData() {
    this.lista = null;
    this.order = null;
    this.adminCPublica = null;
    this.store = {};

    this.RSACipher.clearData();
  }

  async cifrarVoto(voto, clavePrivada) {
    return await new Promise((resolve, reject) => {
      this.store = {"first" : null, "encrypted" : {}, "strings" : {}, "adminEncrypted" : null}

      this.crearCifradores(clavePrivada);
      this.primeraFaseCifrado(voto).then(res => {
        this.segundaFaseCifrado(res).then(cifrado => {
          console.log(this.store)
          resolve(cifrado)
        });
      });
    });
  }

  crearCifradores(clavePrivada) {
    var l = this.controllerVotacion.getLista();
    this.lista = l.list;
    this.order = l.order;
    this.adminCPublica = l.adminClavePublica;
    this.RSACipher.newCifrador("admin", this.adminCPublica)

    for (var key of Object.keys(this.lista)) {
      var el = this.lista[key];
      if (key == this.order) {
        this.RSACipher.ownCifrador(key, el["clavePublica"], clavePrivada)
      } else {
        this.RSACipher.newCifrador(key, el["clavePublica"])
      }
    }
  }

  crearCifradoresAdmin(clavePrivada) {
    this.lista = this.controllerVotacion.getLista();
    this.RSACipher.ownCifrador("admin", this.lista.adminClavePublica, clavePrivada)
    for (var key of Object.keys(this.lista)) {
      var el = this.lista[key];
      this.RSACipher.newCifrador(key, el["clavePublica"])
    }
  }

  async primeraFaseCifrado(voto) {
    return await new Promise((resolve, reject) => {
      var r1 = this.KeyGenerator.generateRandom();
      this.store["first"] = r1 + "";
      var res = voto + "###" + r1;
      // console.log("ENCRIPTANDO ADMIN");
      res = this.RSACipher.encrypt(res, "admin");
      this.store["adminEncrypted"] = res;

      for (var key of Object.keys(this.lista).reverse()) {
        // console.log("ENCRIPTANDO " + key);
        res = this.RSACipher.encrypt(res, key);
        this.store["encrypted"][key] = res;
      }
      resolve(res)
    });
  }

  async segundaFaseCifrado(res) {
    return await new Promise((resolve, reject) => {
      for (var key of Object.keys(this.lista).reverse()) {
        // console.log("ENCRIPTANDO 2a FASE " + key);
        var r = this.KeyGenerator.generateRandom();
        this.store["strings"][key] = r + "";
        res = this.RSACipher.encrypt(res + "###" + r, key);
      }
      resolve(res)
    });
  }

  async descifrarListaVotosFirstPart(l) {
    return await new Promise((resolve, reject) => {
      var list = this.shuffle(l)
      var check = this.store["strings"][this.order];
      var listDescifrados = []
      var strings = []

      for (var i = 0; i<list.length; i++) { 
        var res = this.RSACipher.decrypt(list[i], this.order);
        var arr = res.split("###");
        listDescifrados.push(arr[0]);
        strings.push(arr[1]);
      }

      if (strings.includes(check)) {
        resolve(listDescifrados)
      } else {
        reject(false)
      }
    });
  }

  async descifrarListaVotosSecondPart(list) {
    return await new Promise((resolve, reject) => {
      var check = this.store["encrypted"][this.order];
      var listDescifrados = []

      if (list.includes(check)) {
        for (var i = 0; i<list.length; i++) { 
          var res = this.RSACipher.decrypt(list[i], this.order);
          var sign = this.RSACipher.sign(res, this.order)
          var dict = {cifrado : res, signature : sign}
          listDescifrados.push(dict);
        }
        var dic = {origen : this.order, list: listDescifrados}
        resolve(dic)
      } else {
        reject(false)
      }
    });
  }

  async descifrarListaVotosAdminPart(list) {
    return await new Promise((resolve, reject) => {
      var listDescifrados = []
      for (var i = 0; i<list.length; i++) { 
        var res = this.RSACipher.decrypt(list[i], "admin");
        listDescifrados.push(res);
      }
      var sign = this.RSACipher.sign(listDescifrados, "admin")
      var dict = {datos : listDescifrados, signature : sign}
      resolve(dict);
    });
  }

  async cifrarListaVotosAdmin(str) : Promise<Array<Object>> {
    return await new Promise((resolve, reject) => {
      var cifrados = []
      for (var key of Object.keys(this.lista)) {
        var res = this.RSACipher.encrypt(str, key);
        cifrados.push({ip: this.lista[key].ip, fase: "Y" , data: res})
      }
      resolve(cifrados)
    });
  }

  async checkEncryptedPresent(list, id) {
    return await new Promise((resolve, reject) => {
      var check;
      if (id == "admin") {
        check = this.store["adminEncrypted"];
      } else {
        check = this.store["encrypted"][id];
      }
      if (list.includes(check)) {  
        resolve(true);
      } else {
        reject(false);
      }
    })
  }

  async checkLastString(cifrado) {
    return await new Promise((resolve, reject) => {
      var res = this.RSACipher.decrypt(cifrado, this.order);
      var votos = JSON.parse(res)
      var signCorrect = this.RSACipher.validateSign(votos.datos, votos.signature, "admin")
      if (signCorrect) {
        var check = this.store["first"];
        var vots = []
        for (var vote of votos.datos) {
          var v = vote.split("###")[1];
          vots.push(v)
        }
        if (vots.includes(check)) {
          resolve(true)
        } else {
          reject(false)
        }
      } else {
        reject(false)
      }
    })
  }

  async checkSignature(dict, firstVotante) {
    return await new Promise((resolve, reject) => {
      if (firstVotante) {
        resolve(dict)
      } else {
        var listSinFirma = []
      
        var list = dict.list;
        var origin = dict.origen;
  
        for (var i = 0; i<list.length; i++) { 
          var datos = list[i];
          var signCorrect = this.RSACipher.validateSign(datos.cifrado, datos.signature, origin)
          if (!signCorrect) {
            reject(false)
          } 
          listSinFirma.push(datos.cifrado)
        }
        resolve(listSinFirma)
      }
    });
  }

  shuffle(list) {
    var l = []
    var numbers = [];
    var total = list.length
    var array = new Uint8Array(1);
    for (var i = 0; i<total; i++) {
      let num = window.crypto.getRandomValues(array)[0] % total;
      while (numbers.includes(num)) {
        num = window.crypto.getRandomValues(array)[0] % total;
      }
      l.push(list[num])
      numbers.push(num)
    }
    return l;
  }
}
