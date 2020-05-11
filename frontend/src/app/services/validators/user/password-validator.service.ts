import { Injectable } from '@angular/core';
import { GeneralValidatorService } from '../general/general-validator.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordValidatorService {

  constructor(private generalValidator: GeneralValidatorService) { }

  checkNewPassword(actual, nueva, repetir) {
    var errors = {}
    if (actual == null) {
      this.checkPasswordFirst(nueva, repetir, errors)
    } else {
      var res = this.checkPasswordGroup(actual, nueva, repetir, errors)
      if (res) {
        this.checkPassword(nueva, errors)
      }
    }
    
    if (Object.keys(errors).length == 0) {
      return true
    } else {
      return errors
    }
  }

  checkPasswordFirst(nueva, repetir, errors) {
    if (nueva == "" || repetir == "") {
      if (nueva == "") {
        errors["nueva"] = "required"
      }
      if (repetir == "") {
        errors["repetir"] = "required"
      }
    } else if (nueva != repetir) {
      errors["repetir"] = "notSame" 
    } else if (nueva.length < 8) {
      errors["nueva"] = "length"
    } else {
      var res = {numb: false, str: false}
      this.generalValidator.checkStringsNumbers(nueva, res)
      if (!res.numb || !res.str) {
        errors["nueva"] = "badFormed"
      }
    } 
  }

  checkPasswordGroup(actual, nueva, repetir, errors) {
    if (actual == "" || nueva == "" || repetir == "") {
      errors["passwd"] = "required"
      return false
    } else if (nueva == actual) {
      errors["passwd"] = "notChanged"
      return false
    } else if (nueva != repetir) {
      errors["passwd"] = "notSame" 
      return false
    } else {
      return true
    }
  }

  checkPassword(passwd, errors) {
    if (this.generalValidator.checkRequired("passwd", passwd, errors)) {
      if (passwd.length < 8) {
        errors["passwd"] = "length"
      } else {
        var res = {numb: false, str: false}
        this.generalValidator.checkStringsNumbers(passwd, res)
        if (!res.numb || !res.str) {
          errors["passwd"] = "badFormed"
        }
      } 
    }
  }
}
