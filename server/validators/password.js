const usuarioValidator = require('./usuario.js')
const auxiliarPasswd = require('./auxiliares/auxiliarPassword.js')

async function checkModifyPassword(db, body) {
    return await new Promise((resolve, reject) => {
        usuarioValidator.checkExistentUser(db, body.DNI).then(() => {
            checkFirstPassword(db, body.usuario.DNI).then(() => {
                var res = auxiliarPasswd.checkModifyPassword(body)
                if (res == true) {
                    resolve(true)
                } else {
                    var error = {code: 409, error: res}
                    reject(error);
                }
            }).catch(err => {
                var error = {code: 403, error: 'Restricted Access'}
                reject(error);
            })
        }).catch((err) => {
            var error = {code: 404, error: "Not Found"}
            reject(error);
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