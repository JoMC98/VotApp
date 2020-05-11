import { Injectable } from '@angular/core';
import { PasswordValidatorService } from './password-validator.service';
import { GeneralValidatorService } from '../general/general-validator.service';

@Injectable({
  providedIn: 'root'
})
export class UserValidatorService {

  constructor(private passwordValidator: PasswordValidatorService, private generalValidator: GeneralValidatorService) { }

  async checkPersonal(usuario) {
    return await new Promise((resolve, reject) => {
      var errors = {}
      this.checkNameApellidos("nombre", usuario.nombre, errors)
      this.checkNameApellidos("apellidos", usuario.apellidos, errors)
      this.checkDNI(usuario.DNI, errors)
      this.passwordValidator.checkPassword(usuario.passwd, errors)

      if (Object.keys(errors).length == 0) {
        resolve(true)
      } else {
        reject(errors)
      }
    })
  }

  async checkContact(usuario) {
    return await new Promise((resolve, reject) => {
      var errors = {}
      this.checkTelefono(usuario.telefono, errors)
      this.checkMail(usuario.mail, errors)
      this.generalValidator.checkRequired("departamento", usuario.departamento, errors)
      this.generalValidator.checkRequired("cargo", usuario.cargo, errors)

      if (Object.keys(errors).length == 0) {
        resolve(true)
      } else {
        reject(errors)
      }
    })
  }

  checkUser(usuario) {
    var errors = {}
    this.checkNameApellidos("nombre", usuario.nombre, errors)
    this.checkNameApellidos("apellidos", usuario.apellidos, errors)
    this.checkDNI(usuario.DNI, errors)
    this.checkTelefono(usuario.telefono, errors)
    this.checkMail(usuario.mail, errors)
    this.generalValidator.checkRequired("departamento", usuario.departamento, errors)
    this.generalValidator.checkRequired("cargo", usuario.cargo, errors)

    if (Object.keys(errors).length == 0) {
      return true
    } else {
      return errors
    }
  }

  checkNameApellidos(att, value, errors) {
    if (this.generalValidator.checkRequired(att, value, errors)) {
      var res = {numb: false, str: false}
      this.generalValidator.checkStringsNumbers(value, res)
      if (res.numb) {
        errors[att] = "badFormed"
      }
    }
  }

  checkDNI(DNI, errors) {
    if (this.generalValidator.checkRequired("DNI", DNI, errors)) {
      if (DNI.length != 9) {
        errors["DNI"] = "length"
      } else {
        if (isNaN(DNI.slice(0, 8)) || !isNaN(DNI.charAt(8))) {
          errors["DNI"] = "badFormed"
        }
      }
    } 
  }

  checkTelefono(telefono, errors) {
    if (this.generalValidator.checkRequired("telefono", telefono, errors)) {
      if (telefono.toString().length < 7 || telefono.toString().length > 11) {
        errors["telefono"] = "length"
      }
    }
  }

  checkMail(mail, errors) {
    if (this.generalValidator.checkRequired("mail", mail, errors)) {
      var patt = /\S+@\S+\.\S+/
      if (!patt.test(mail)) {
        errors["mail"] = "badFormed"
      }
    }
  }
}


