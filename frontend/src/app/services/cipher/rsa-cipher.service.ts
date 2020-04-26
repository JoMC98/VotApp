import { Injectable } from '@angular/core';
import * as JsEncryptModule from 'jsencrypt';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class RSACipherService {

  cifradores = {};

  constructor() { }

  clearData() {
    this.cifradores = {}
  }

  ownCifrador(id, publicKey, privateKey) {
    var RSAcipher = new JsEncryptModule.JSEncrypt();
    RSAcipher.setPublicKey(publicKey);
    RSAcipher.setPrivateKey(privateKey);
    this.cifradores[id] = RSAcipher;
  }

  newCifrador(id, publicKey) {
    var RSAcipher = new JsEncryptModule.JSEncrypt();
    RSAcipher.setPublicKey(publicKey);
    this.cifradores[id] = RSAcipher;
  }

  encrypt(message, id): Promise<string> {
    return new Promise((resolve, reject) => {
      var cifrador = this.cifradores[id];

      var numBloques = Math.ceil(((message.length) / 245));
      var vectorBloques = [];

      for (var i = 0; i < numBloques; i++) { 
        let ini = 0;
        let fin = 0;
        if (i == numBloques - 1) {
          ini = i * 245
          fin = message.length
        } else {
          ini = i * 245
          fin = ini + 245
        }
        let bloqueChar = message.slice(ini, fin)
        vectorBloques.push(bloqueChar);
      }

      var messageEncrypted = "";
      
      var partes = []

      for (var i = 0; i < numBloques; i++) {
        var cad = vectorBloques[i]
        var bloque = cifrador.encrypt(cad);
        var j = 0;
        while (bloque.length != 344 && j < 300) {
          var bloque = cifrador.encrypt(cad);
          j++;
        }
        partes.push(bloque)
        messageEncrypted += bloque;
      }

      resolve(messageEncrypted);
    });
  }

  decrypt(messageEncrypted, id): Promise<string> {
    return new Promise((resolve, reject) => {
      var cifrador = this.cifradores[id];

      var numBloques = Math.ceil(((messageEncrypted.length) / 344));
      var vectorBloques = [];

      for (var i = 0; i < numBloques; i++) { 
        let ini = 0;
        let fin = 0;
        if (i == numBloques - 1) {
          ini = i * 344
          fin = messageEncrypted.length
        } else {
          ini = i * 344
          fin = ini + 344
        }
        let bloqueChar = messageEncrypted.slice(ini, fin)
        vectorBloques.push(bloqueChar);
      }

      var message = "";

      
      for (var i = 0; i < numBloques; i++) {
        var cad = vectorBloques[i]
        var bloque = cifrador.decrypt(cad);
        message += bloque;
      }

      resolve(message);
    })
  }

  sign(message, id): Promise<string> {
    return new Promise((resolve, reject) => {
      var cifrador = this.cifradores[id];

      var signature = cifrador.sign(message, CryptoJS.MD5, "md5");

      resolve(signature);
    })
  }

  validateSign(message, signature, id): Promise<string> {
    return new Promise((resolve, reject) => {
      var cifrador = this.cifradores[id];

      var verified = cifrador.verify(message, signature, CryptoJS.MD5);

      resolve(verified);
    })
  }

}
