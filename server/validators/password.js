const usuarioValidator = require('./usuario.js')
const controlAccess = require('../models/acceso/controlAccessHelpers.js');
const encryptor = require('../helpers/passwordEncryptor.js');

async function checkModifyPassword(db, body, first) {
    return await new Promise((resolve, reject) => {
        usuarioValidator.checkExistentUser(db, body.DNI).then(() => {
            if (first) {
                checkFirstPassword(db, body.usuario.DNI).then(() => {
                    //TODO CHECK VALORES
                    resolve(true)
                }).catch(err => {
                    var error = {code: 403, error: 'Restricted Access'}
                    reject(error);
                })
            } else {
                checkPassword(db, body).then(() => {
                    //TODO CHECK VALORES
                    resolve(true)
                }).catch(err => {
                    var error = {code: 406, error: 'Incorrect Password'}
                    reject(error);
                })
            }
        }).catch((err) => {
            var error = {code: 404, error: "Not Found"}
            reject(error);
        })
    })
}

async function checkPassword(db, body) {
    return await new Promise((resolve, reject) => {
        controlAccess.obtenerContrasenya(db, body.DNI).then((results) => {
            encryptor.comparePassword(body.actual, results[0].passwd).then(equals => {
                if (!equals) {
                    reject(false)
                } else {
                    resolve(true)
                }
            })
        })
    })
}

async function checkFirstPassword(db, DNI) {
    return await new Promise((resolve, reject) => {
        db.query(
            'SELECT clavePublica, clavePrivada FROM Usuario WHERE dni = ?', 
            [DNI], (error, results) => {
                if (error) {
                    reject(false)
                } else {
                    if (results[0].clavePublica == null || results[0].clavePrivada == null) {
                        resolve(true)
                    } else {
                        reject(false)
                    }
                }
        })
    })
}


module.exports = {
    checkModifyPassword: checkModifyPassword
};