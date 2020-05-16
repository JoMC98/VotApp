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
    checkClavePublica(passwords.clavePrivada, errors)

    if (Object.keys(errors).length == 0) {
      return true
    } else {
      return errors
    }
  }

  function checkClavePublica(clave, errors) {
    if (generalValidator.checkRequired("clavePublica", clave, errors)) {
      var first = clave.substr(0, 26)
      var last = clave.substr(clave.length-24)
      if (first != "-----BEGIN PUBLIC KEY-----" || last != "-----END PUBLIC KEY-----") {
        erors["clavePublica"] = "badFormed"
      }
    }
  }

  function checkClavePrivada(clave, errors) {
    if (generalValidator.checkRequired("clavePrivada", clave, errors)) {
      if (clave.length != 2339) {
        erors["clavePrivada"] = "badFormed"
      } else {
        var saltChar = clave.substr(0, 9)
        var ivChar = clave.substr(41, 8)
        var cipChar = clave.substr(49, 16)
        var lastChar = clave.substr(2338)
        console.log(saltChar)
        console.log(ivChar)
        console.log(cipChar)
        console.log(lastChar)
      }
    }
  }

  {"salt":"fd63fc9daa061fbbfa5b36783ecaf119","iv":"f8fa3a03f8dbd4d2cde59bf18ef47d8d","cipherText":"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"}

  async function checkPasswordCorrect(db, passwords, DNI) {
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

  module.exports = {
    checkPasswordCorrect: checkPasswordCorrect,
    checkModifyPassword: checkModifyPassword,
    checkPassword: checkPassword
};