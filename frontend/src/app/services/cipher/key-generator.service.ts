import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ConfigurationService } from '../general/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class KeyGeneratorService {

  constructor(private config: ConfigurationService) { }

  convertToPem(buf, key) {
    var exportedAsString = String.fromCharCode.apply(null, new Uint8Array(buf));
    var exportedAsBase64 = window.btoa(exportedAsString);
    var pemExported = `-----BEGIN ${key} KEY-----\n${exportedAsBase64}\n-----END ${key} KEY-----`;
    return pemExported
  }

  async generateRSAKeyPair() {
    var keyPair = await window.crypto.subtle.generateKey(
      {
        name: this.config.RSA_ALGORITHM,
        modulusLength: this.config.RSA_KEY_LENGTH,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: this.config.RSA_HASH_FUNCTION
      },
      true,
      ["encrypt", "decrypt"]
    )


    var publicKey = this.convertToPem(await window.crypto.subtle.exportKey("spki", keyPair.publicKey), "PUBLIC")
    var privateKey = this.convertToPem(await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey), "PRIVATE")
    
    var keys = {private: privateKey, public: publicKey}

    return keys
  }

  generatePBKDF2Key(password, salt) {
    var secretKey = CryptoJS.PBKDF2(password, salt, { keySize: this.config.PBKDF2_KEY_BIT_LENGTH / 32, iterations: this.config.PBKDF2_ITERATIONS });
    return secretKey;
  }

  generateSalt() {
    return CryptoJS.lib.WordArray.random(this.config.PBKDF2_SALT_BYTES);
  }

  generateRandom() {
    return CryptoJS.lib.WordArray.random(this.config.RANDOM_NUMBER_BYTES);
  }

  generateIV() {
    return CryptoJS.lib.WordArray.random(this.config.AES_IV_BYTES);
  }
}
