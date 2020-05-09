import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserValidatorService {

  constructor() { }

  async checkPersonal(usuario) {
    return await new Promise((resolve, reject) => {
      var errors = {}
      this.checkNameApellidos("nombre", usuario.nombre, errors)
      this.checkNameApellidos("apellidos", usuario.apellidos, errors)
      this.checkDNI(usuario.DNI, errors)
      this.checkPassword(usuario.passwd, errors)

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
      this.checkRequired("departamento", usuario.departamento, errors)
      this.checkRequired("cargo", usuario.cargo, errors)

      if (Object.keys(errors).length == 0) {
        resolve(true)
      } else {
        reject(errors)
      }
    })
  }

  async checkUser(usuario) {
    return await new Promise((resolve, reject) => {
      var errors = {}

      this.checkNameApellidos("nombre", usuario.nombre, errors)
      this.checkNameApellidos("apellidos", usuario.apellidos, errors)
      this.checkDNI(usuario.DNI, errors)
      this.checkTelefono(usuario.telefono, errors)
      this.checkMail(usuario.mail, errors)
      this.checkRequired("departamento", usuario.departamento, errors)
      this.checkRequired("cargo", usuario.cargo, errors)

      if (Object.keys(errors).length == 0) {
        resolve(true)
      } else {
        reject(errors)
      }
    })
  }

  async checkNewPassword(newPassword) {
    return await new Promise((resolve, reject) => {
      var errors = {}
      this.checkPassword(newPassword, errors)

      if (Object.keys(errors).length == 0) {
        resolve(true)
      } else {
        reject(errors)
      }
    })
  }

  checkRequired(att, value, errors) {
    if (!value) {
      errors[att] = "required"
      return false
    }
    return true
  }

  checkStringsNumbers(value, res) {
    for (var i = 0; i<value.length; i++) {
      var c = value.charAt(i)
      if (c != " ") {
        if (isNaN(c)) {
          res.str = true
        } else {
          res.numb = true
        }
      }
    }
  }

  checkNameApellidos(att, value, errors) {
    if (this.checkRequired(att, value, errors)) {
      var res = {numb: false, str: false}
      this.checkStringsNumbers(value, res)
      if (res.numb) {
        errors[att] = "badFormed"
      }
    }
  }

  checkDNI(DNI, errors) {
    if (this.checkRequired("DNI", DNI, errors)) {
      if (DNI.length != 9) {
        errors["DNI"] = "length"
      } else {
        if (isNaN(DNI.slice(0, 8)) || !isNaN(DNI.charAt(8))) {
          errors["DNI"] = "badFormed"
        }
      }
    } 
  }

  checkPassword(passwd, errors) {
    if (this.checkRequired("passwd", passwd, errors)) {
      if (passwd.length < 8) {
        errors["passwd"] = "length"
      } else {
        var res = {numb: false, str: false}
        this.checkStringsNumbers(passwd, res)
        if (!res.numb || !res.str) {
          errors["passwd"] = "badFormed"
        }
      } 
    }
  }

  checkTelefono(telefono, errors) {
    if (this.checkRequired("telefono", telefono, errors)) {
      if (telefono.toString().length < 7 || telefono.toString().length > 11) {
        errors["telefono"] = "length"
      }
    }
  }

  checkMail(mail, errors) {
    if (this.checkRequired("mail", mail, errors)) {
      var patt = /\S+@\S+\.\S+/
      if (!patt.test(mail)) {
        errors["mail"] = "badFormed"
      }
    }
  }
}


