import { Injectable } from '@angular/core';
import { KeyGeneratorService } from './key-generator.service';
import { AESCipherService } from './aes-cipher.service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class KeyPasswordControllerService {

  constructor(private keyGenerator: KeyGeneratorService, private AESCipher: AESCipherService) { }

  async generateAndEncryptKeyPair(password) {
    return await new Promise((resolve, reject) => {
      var salt = this.keyGenerator.generateSalt()
      var iv = this.keyGenerator.generateIV()
      var keyPair = this.keyGenerator.generateRSAKeyPair()

      var credentials = {password: password, salt: salt, iv: iv}
      var datos = this.AESCipher.encrypt(credentials, keyPair.private)

      resolve(JSON.stringify(datos))
    });
  }

  async decryptPrivateKey(password, datos) {
    return await new Promise((resolve, reject) => {
      var data = JSON.parse(datos)

      var cipherText = data.cipherText
      var credentials = {password: password, salt: data.salt, iv: data.iv}
  
      var privateKey = this.AESCipher.decrypt(credentials, cipherText)
      
      resolve(privateKey)
    });
  }
}
