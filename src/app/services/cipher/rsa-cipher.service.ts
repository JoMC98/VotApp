import { Injectable } from '@angular/core';
import * as JsEncryptModule from 'jsencrypt';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class RSACipherService {

  cifradores = {};

  constructor() { }

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

  encrypt(message, id) {
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

    console.log(vectorBloques)

    var messageEncrypted = "";
    
    for (var i = 0; i < numBloques; i++) {
      var cad = vectorBloques[i]
      var bloque = cifrador.encrypt(cad);
      messageEncrypted += bloque;
    }

    return messageEncrypted;
  }

  decrypt(messageEncrypted, id) {
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

    return message;
  }

  sign(message, id) {
    var cifrador = this.cifradores[id];

    var signature = cifrador.sign(message, CryptoJS.MD5, "md5");

    return signature;
  }

  validateSign(message, signature, id) {
    var cifrador = this.cifradores[id];

    var verified = cifrador.verify(message, signature, CryptoJS.MD5);

    return verified;
  }

}
