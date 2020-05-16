const generalValidator = require('../general.js')
const passwordAux = require('./auxiliarPassword.js')
const dptos = require('../../public/assets/files/departamentos.json')
const departamentos = Object.keys(dptos)

exports.checkNewUser = (usuario, newUser) => {
    var errors = {}
    checkName(usuario.nombre, errors)
    checkApellidos(usuario.apellidos, errors)
    checkDNI(usuario.DNI, errors)
    checkTelefono(usuario.telefono, errors)
    checkMail(usuario.mail, errors)
    checkDepartamento(usuario.departamento, errors)
    checkCargo(usuario.cargo, errors)
    if (newUser) {
        passwordAux.checkPassword(usuario.passwd, errors)
    }

    if (Object.keys(errors).length == 0) {
        return true
    } else {
        return errors
    }
}

  function checkName(value, errors) {
    if (generalValidator.checkRequired("nombre", value, errors)) {
      if (generalValidator.checkLength("nombre", value, 20, errors)) {
        var res = {numb: false, str: false}
        generalValidator.checkStringsNumbers(value, res)
        if (res.numb) {
          errors[att] = "badFormed"
        }
      }
    }
  }

  function checkApellidos(value, errors) {
    if (generalValidator.checkRequired("apellidos", value, errors)) {
      if (generalValidator.checkLength("apellidos", value, 40, errors)) {
        var res = {numb: false, str: false}
        generalValidator.checkStringsNumbers(value, res)
        if (res.numb) {
          errors[att] = "badFormed"
        }
      }
    }
  }

  function checkDNI(DNI, errors) {
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

  function checkTelefono(telefono, errors) {
    if (generalValidator.checkRequired("telefono", telefono, errors)) {
      var res = {numb: false, str: false}
      generalValidator.checkStringsNumbers(telefono, res)
      if (res.str) {
        errors["telefono"] = "badFormed"
      } else {
        if (telefono.toString().length < 7 || telefono.toString().length > 11) {
          errors["telefono"] = "length"
        }
      }
    }
  }

  function checkMail(mail, errors) {
    if (generalValidator.checkRequired("mail", mail, errors)) {
      if (generalValidator.checkLength("mail", mail, 40, errors)) {
        var patt = /\S+@\S+\.\S+/
        if (!patt.test(mail)) {
          errors["mail"] = "badFormed"
        }
      }
    }
  }

  function checkCargo(value, errors) {
    if (generalValidator.checkRequired("cargo", value, errors)) {
      generalValidator.checkLength("cargo", value, 40, errors)
    }
  }

  function checkDepartamento(departamento, errors) {
    if (generalValidator.checkRequired("departamento", departamento, errors)) {
        if (!departamentos.includes(departamento)) {
            errors["departamento"] = "notValid"
        }
    }
}
  
  exports.checkDuplicateKeys = async (db, DNI, mail) => {
    return await new Promise((resolve, reject) => {
        db.query(
            'SELECT DNI FROM Usuario WHERE DNI = ?', [DNI], (error, resDni) => {
                if (error) {
                    reject(false)
                } else {
                    db.query(
                    'SELECT DNI FROM Usuario WHERE mail = ?', [mail], (error, resMail) => {
                        if (error) {
                            reject(false)
                        } else {
                            var duplicate = {}
                            if (resDni.length > 0) {
                                duplicate["DNI"] = "duplicated"
                            }
                            if (resMail.length > 0) {
                                duplicate["mail"] = "duplicated"
                            }

                            if (Object.keys(duplicate).length > 0) {
                                reject(duplicate)
                            } else {
                                resolve(true)
                            }
                        }
                    })
                }
        })
    })
}

exports.checkDuplicateMail = async (db, DNI, mail) => {
  return await new Promise((resolve, reject) => {
      db.query(
          'SELECT DNI FROM Usuario WHERE mail = ?', [mail], (error, resMail) => {
              if (error) {
                  reject(false)
              } else {
                  if (resMail.length == 0 || resMail[0].DNI == DNI) {
                      resolve(true)
                  } else {
                      reject({"mail" : "duplicated"})
                  }
              }
      })
  })
}

