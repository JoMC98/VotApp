const generalValidator = require('../general.js')
const encryptor = require('../../helpers/passwordEncryptor.js')
const controlAccess = require('../../models/acceso/controlAccessHelpers.js')

function checkPassword(passwd, errors) {
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

  function checkModifyPassword(passwords) {
    var errors = {}
    checkPassword(passwords.nueva, errors)
    checkClavePublica(passwords.clavePublica, errors)
    checkClavePrivada(passwords.clavePrivada, errors)

    if (Object.keys(errors).length == 0) {
      return true
    } else {
      return errors
    }
  }

  function checkClavePublica(clave, errors) {
    if (generalValidator.checkRequired("clavePublica", clave, errors)) {
      if (clave.length != 444) {
        errors["clavePublica"] = "badFormed"
      } else {
        var first = clave.substr(0, 26)
        var last = clave.substr(clave.length-24)
        if (first != "-----BEGIN PUBLIC KEY-----" || last != "-----END PUBLIC KEY-----") {
          errors["clavePublica"] = "badFormed"
        }
      }
    }
  }

  function checkClavePrivada(clave, errors) {
    if (generalValidator.checkRequired("clavePrivada", clave, errors)) {
      if (clave.length != 2339) {
        errors["clavePrivada"] = "badFormed"
      } else {
        var saltChar = clave.substr(0, 9)
        var ivChar = clave.substr(41, 8)
        var cipChar = clave.substr(81, 16)
        var lastChar = clave.substr(2337)
        if (saltChar != '{"salt":"' || ivChar != '","iv":"' || cipChar != '","cipherText":"' || lastChar != '"}') {
          errors["clavePrivada"] = "badFormed"
        }
      }
    }
  }

  async function checkPasswordCorrect(db, passwords, DNI) {
    return await new Promise((resolve, reject) => {
      var errors = {}
      if (generalValidator.checkRequired("actual", passwords.actual, errors)) {
        controlAccess.obtenerContrasenya(db, DNI).then((results) => {
            encryptor.comparePassword(passwords.actual, results[0].passwd).then(equals => {
              if (!equals) {
                  errors = {passwd: "incorrect"}
                  reject(errors);
              } else {
                  resolve(true)
              }
            })
        })
      } else {
        reject(errors);
      }
    })
  }

  module.exports = {
    checkPasswordCorrect: checkPasswordCorrect,
    checkModifyPassword: checkModifyPassword,
    checkPassword: checkPassword
};