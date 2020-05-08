const encryptor = require('../helpers/passwordEncryptor.js');

async function checkLogin(db, body) {
    return await new Promise((resolve, reject) => {
        //TODO CHECK VALORES
        checkDNI(db, body.dni).then(user => {
            checkPassword(body.passwd, user.passwd).then(() => {
                resolve(user)
            }).catch((err) => {
                var error = {code: 401, error: 'Incorrect User or Password'}
                reject(error);  
            })
        }).catch((err) => {
            reject(err);
        })
    })
}

async function checkDNI(db, dni) {
    return await new Promise((resolve, reject) => {
        db.query(
            'SELECT *, COUNT(f_autorizado) AS admin FROM Usuario LEFT JOIN Administrador USING (dni) WHERE dni = ?' , [dni], (error, results) => {
                if (error) {
                    var error = {code: 500, error: 'error'}
                    reject(error);  
                } else {
                    if (results[0].DNI == null) {
                        var error = {code: 401, error: 'Incorrect User or Password'}
                        reject(error);  
                    } else {
                        resolve(results[0])
                    }
                }
        })
    })
}

async function checkPassword(password, passwordIntroduced) {
    return await new Promise((resolve, reject) => {
        encryptor.comparePassword(passwordIntroduced, password).then(equals => {
            if (!equals) {
                reject(false)
            } else {
                resolve(true)
            }
        })
    })
}

module.exports = {
    checkLogin: checkLogin
};