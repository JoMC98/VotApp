import { Injectable } from '@angular/core';
import { KeyGeneratorService } from './key-generator.service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AESCipherService {

  constructor(private KeyGenerator: KeyGeneratorService) { }

  encrypt(credentials, message) {
    var secretKey = this.KeyGenerator.generatePBKDF2Key(credentials.password, credentials.salt)

    var res = CryptoJS.AES.encrypt(message, secretKey, 
      { iv: credentials.iv, 
        padding: CryptoJS.pad.Pkcs7, 
        mode: CryptoJS.mode.CBC
      });

    var salt = CryptoJS.enc.Hex.stringify(credentials.salt)
    var iv = CryptoJS.enc.Hex.stringify(credentials.iv)
    var cipherText = CryptoJS.enc.Base64.stringify(res.ciphertext)

    return {salt: salt, iv: iv, cipherText: cipherText};
  }

  decrypt(credentials, messageEncrypted) {
    var salt = CryptoJS.enc.Hex.parse(credentials.salt)
    var iv = CryptoJS.enc.Hex.parse(credentials.iv)

    var secretKey = this.KeyGenerator.generatePBKDF2Key(credentials.password, salt)

    var res = CryptoJS.AES.decrypt(messageEncrypted, secretKey, 
      { iv: iv, 
        padding: CryptoJS.pad.Pkcs7, 
        mode: CryptoJS.mode.CBC
      });

    return CryptoJS.enc.Utf8.stringify(res)
  }

}
