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
  store = {};

  constructor(private controllerVotacion: DatosVotacionControllerService, 
    private AESCipher:AESCipherService, private RSACipher:RSACipherService, private KeyGenerator: KeyGeneratorService) { }

  async cifrarVoto(voto, clavePrivada) {
    return await new Promise((resolve, reject) => {
      this.store = {"first" : null, "encrypted" : {}, "strings" : {}}

      this.crearCifradores(clavePrivada);
      this.primeraFaseCifrado(voto).then(res => {
        this.segundaFaseCifrado(res).then(cifrado => {
          console.log(this.store)
          console.log(cifrado)
          resolve(true)
        });
      });
    });
  }

  crearCifradores(clavePrivada) {
    var l = this.controllerVotacion.getLista();
    this.lista = l.list;
    this.order = l.order;
    for (var key of Object.keys(this.lista)) {
      var el = this.lista[key];
      if (key == this.order) {
        this.RSACipher.ownCifrador(key, el["clavePublica"], clavePrivada)
      } else {
        this.RSACipher.newCifrador(key, el["clavePublica"])
      }
    }
  }

  async primeraFaseCifrado(voto) {
    return await new Promise((resolve, reject) => {
      var r1 = this.KeyGenerator.generateRandom();
      this.store["first"] = r1 + "";
      var res = voto + "###" + r1;

      for (var key of Object.keys(this.lista).reverse()) {
        console.log("ENCRIPTANDO " + key);
        res = this.RSACipher.encrypt(res, key);
        this.store["encrypted"][key] = res;
      }
      resolve(res)
    });
  }

  async segundaFaseCifrado(res) {
    return await new Promise((resolve, reject) => {
      for (var key of Object.keys(this.lista).reverse()) {
        console.log("ENCRIPTANDO 2a FASE " + key);
        var r = this.KeyGenerator.generateRandom();
        this.store["strings"][key] = r + "";
        res = this.RSACipher.encrypt(res + "###" + r, key);
      }
      resolve(res)
    });
  }

}
