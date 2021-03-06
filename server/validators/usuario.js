const auxiliar = require('./auxiliares/auxiliarUsuario.js')
const auxiliarPasswd = require('./auxiliares/auxiliarPassword.js')

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
        var res = auxiliar.checkNewUser(user, true)
        if (res == true) {
            auxiliar.checkDuplicateKeys(db, user.DNI, user.mail).then(() => {
                resolve(true)
            }).catch((err) => {
                var error = {code: 409, error: err}
                reject(error);
            })
        } else {
            var error = {code: 409, error: res}
            auxiliar.checkDuplicateKeys(db, user.DNI, user.mail).then(() => {
                reject(error);
            }).catch((err) => {
                if (err["DNI"]) {
                    error.error["DNI"] = err["DNI"]
                }
                if (err["mail"]) {
                    error.error["mail"] = err["mail"]
                }
                reject(error);
            })
        }
        
    })
}

async function checkModifyUser(db, user) {
    return await new Promise((resolve, reject) => {
        checkExistentUser(db, user.DNI).then(() => {
            if (user.data != undefined && user.passwords != undefined) {
                if (user.data) {
                    checkModifyUserData(db, user).then(() => {
                        if (user.passwords) {
                            checkModifyPasswdData(db, user).then(() => {
                                resolve("both")
                            }).catch(err => {
                                reject(err)
                            })
                        } else {
                            resolve("data")
                        }
                    }).catch(err => {
                        if (user.passwords) {
                            checkModifyPasswdData(db, user).then(() => {
                                reject(err)
                            }).catch(error => {
                                for (var k of Object.keys(error.error)) {
                                    err.error[k] = error.error[k]
                                }
                                reject(err)
                            })
                        } else {
                            reject(err)
                        }
                    })
                } else {
                    if (user.passwords) {
                        checkModifyPasswdData(db, user).then(() => {
                            resolve("passwd")
                        }).catch(err => {
                            reject(err)
                        })
                    } else {
                        var error = {code: 409, error: "Bad format"}
                        reject(error);
                    }
                }
            } else {
                var error = {code: 409, error: "Bad format"}
                reject(error);
            }
        }).catch((err) => {
            var error = {code: 404, error: "Not Found"}
            reject(error);
        })
       
    })
}

async function checkModifyUserData(db, user) {
    return await new Promise((resolve, reject) => {
        var res = auxiliar.checkNewUser(user, false)
        if (res == true) {
            auxiliar.checkDuplicateMail(db, user.DNI, user.mail).then(() => {
                resolve(true)
            }).catch((err) => {
                var error = {code: 409, error: err}
                reject(error);
            })
        } else {
            var error = {code: 409, error: res}
            auxiliar.checkDuplicateMail(db, user.DNI, user.mail).then(() => {
                reject(error)
            }).catch((err) => {
                if (err["mail"]) {
                    error.error["mail"] = err["mail"]
                }
                reject(error);
            })
        }   
    })
}

async function checkModifyPasswdData(db, user) {
    return await new Promise((resolve, reject) => {
        user.passwords.clavePrivada = JSON.stringify(user.passwords.clavePrivada)
        auxiliarPasswd.checkPasswordCorrect(db, user.passwords, user.DNI).then(() => {
            var res = auxiliarPasswd.checkModifyPassword(user.passwords)
            if (res == true) {
                resolve(true)
            } else {
                var error = {code: 409, error: res}
                reject(error);
            }
        }).catch(err => {
            var error = {code: 409, error: err}
            reject(error);
        })
    })
}

module.exports = {
    checkNewUser: checkNewUser,
    checkExistentUser: checkExistentUser,
    checkModifyUser: checkModifyUser
};