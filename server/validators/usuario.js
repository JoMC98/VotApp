async function checkExistentUser(db, dni) {
    return await new Promise((resolve, reject) => {
        db.query(
            'SELECT DNI FROM Usuario WHERE DNI = ?', [dni], (error, resDni) => {
                if (error) {
                    reject(false)
                } else {
                    if (resDni.length > 0) {
                        resolve(true)
                    } else {
                        reject(false)
                    }
                }
        })
    })
}

async function checkNewUser(db, user) {
    return await new Promise((resolve, reject) => {
        checkDuplicateKeys(db, user.DNI, user.mail).then(() => {
              //TODO CHECK VALORES
            resolve(true)
        }).catch((err) => {
            var error = {code: 409, error: err}
            reject(error);
        })
    })
}

async function checkDuplicateKeys(db, DNI, mail) {
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
                            var duplicate = {dni: resDni.length > 0 ? DNI : null, mail: resMail.length > 0 ? mail : null}

                            if (duplicate["dni"] != null || duplicate["mail"] != null) {
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

async function checkModifyUser(db, user) {
    return await new Promise((resolve, reject) => {
        checkExistentUser(db, user.DNI).then(() => {
            checkDuplicateMail(db, user.DNI, user.mail).then(() => {
                //TODO CHECK VALORES
                resolve(true)
            }).catch((err) => {
                var error = {code: 409, error: err}
                reject(error);
            })
        }).catch((err) => {
            var error = {code: 404, error: "Not Found"}
            reject(error);
        })
       
    })
}

async function checkDuplicateMail(db, DNI, mail) {
    return await new Promise((resolve, reject) => {
        db.query(
            'SELECT DNI FROM Usuario WHERE mail = ?', [mail], (error, resMail) => {
                if (error) {
                    reject(false)
                } else {
                    if (resMail.length == 0 || resMail[0].DNI == DNI) {
                        resolve(true)
                    } else {
                        reject({"mail" : mail})
                    }
                }
        })
    })
}


module.exports = {
    checkNewUser: checkNewUser,
    checkExistentUser: checkExistentUser,
    checkModifyUser: checkModifyUser
};