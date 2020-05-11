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

  checkUser(usuario) {
    var errors = {}
    this.checkNameApellidos("nombre", usuario.nombre, errors)
    this.checkNameApellidos("apellidos", usuario.apellidos, errors)
    this.checkDNI(usuario.DNI, errors)
    this.checkTelefono(usuario.telefono, errors)
    this.checkMail(usuario.mail, errors)
    this.checkRequired("departamento", usuario.departamento, errors)
    this.checkRequired("cargo", usuario.cargo, errors)

    if (Object.keys(errors).length == 0) {
      return true
    } else {
      return errors
    }
  }

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
      this.checkStringsNumbers(nueva, res)
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


