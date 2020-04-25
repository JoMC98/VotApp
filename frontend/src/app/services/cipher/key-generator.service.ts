import { Injectable } from '@angular/core';
import * as keypair from 'keypair';
import * as CryptoJS from 'crypto-js';
import { ConfigurationService } from '../general/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class KeyGeneratorService {

  constructor(private config: ConfigurationService) { }

  generateRSAKeyPair() {
    var keyPair = keypair();
    return keyPair
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
