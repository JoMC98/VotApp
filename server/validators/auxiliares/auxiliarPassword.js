const generalValidator = require('../general.js')
const encryptor = require('../../helpers/passwordEncryptor.js')
const controlAccess = require('../../models/acceso/controlAccessHelpers.js')

exports.checkPassword = (passwd, errors) => {
    if (generalValidator.checkRequired("passwd", passwd, errors)) {
      if (passwd.length < 8) {
        errors["passwd"] = "length"
      } else {
        var res = {numb: false, str: false}
        generalValidator.checkStringsNumbers(passwd, res)
        if (!res.numb || !res.str) {
          errors["passwd"] = "badFormed"
        }
      } 
    }
  }

  exports.checkModifyPassword = (passwords, errors) => {
    var errors = {}
    this.checkPassword(passwords.nueva, errors)
    this.checkClavePublica(passwords.clavePublica, errors)
    
    if (Object.keys(errors).length == 0) {
      return true
    } else {
        return errors
    }
  }

  function checkClavePublica(clave, errors) {
    if (generalValidator.checkRequired("clavePublica", clave, errors)) {
      var first = clave.splice(0, 26)
      console.log(first)
      var last = clave.splice(clave.length-25)
      console.log(last)
    }
  }

  exports.checkPasswordCorrect = async (db, passwords, DNI) => {
    return await new Promise((resolve, reject) => {
        controlAccess.obtenerContrasenya(db, DNI).then((results) => {
            encryptor.comparePassword(passwords.actual, results[0].passwd).then(equals => {
                if (!equals) {
                    var error = {passwd: "incorrect"}
                    reject(error);
                } else {
                    //TODO CHECK VALORES
                    resolve(true)
                }
            })
        })
    })
  }