const generalValidator = require('../general.js')
const passwordAux = require('./auxiliarPassword.js')

exports.checkNewUser = (usuario, newUser) => {
    var errors = {}
    checkNameApellidos("nombre", usuario.nombre, errors)
    checkNameApellidos("apellidos", usuario.apellidos, errors)
    checkDNI(usuario.DNI, errors)
    checkTelefono(usuario.telefono, errors)
    checkMail(usuario.mail, errors)
    generalValidator.checkRequired("departamento", usuario.departamento, errors)
    generalValidator.checkRequired("cargo", usuario.cargo, errors)
    if (newUser) {
        passwordAux.checkPassword(usuario.passwd, errors)
    }

    if (Object.keys(errors).length == 0) {
        return true
    } else {
        return errors
    }
}

checkNameApellidos(att, value, errors) {
    if (generalValidator.checkRequired(att, value, errors)) {
      var res = {numb: false, str: false}
      generalValidator.checkStringsNumbers(value, res)
      if (res.numb) {
        errors[att] = "badFormed"
      }
    }
  }

  checkDNI(DNI, errors) {
    if (generalValidator.checkRequired("DNI", DNI, errors)) {
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
    if (generalValidator.checkRequired("telefono", telefono, errors)) {
      if (telefono.toString().length < 7 || telefono.toString().length > 11) {
        errors["telefono"] = "length"
      }
    }
  }

  checkMail(mail, errors) {
    if (generalValidator.checkRequired("mail", mail, errors)) {
      var patt = /\S+@\S+\.\S+/
      if (!patt.test(mail)) {
        errors["mail"] = "badFormed"
      }
    }
  }