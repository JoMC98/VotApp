const encryptor = require('../helpers/passwordEncryptor.js')
const controlAccess = require('../models/acceso/controlAccessHelpers.js')
const auxiliar = require('./auxiliares/auxiliarUsuario.js')

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
            checkDuplicateKeys(db, user.DNI, user.mail).then(() => {
                resolve(true)
            }).catch((err) => {
                var error = {code: 409, error: err}
                reject(error);
            })
        } else {
            var error = {code: 409, error: res}
            checkDuplicateKeys(db, user.DNI, user.mail).then(() => {
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

async function checkModifyUser(db, user) {
    return await new Promise((resolve, reject) => {
        checkExistentUser(db, user.DNI).then(() => {
            if (user.data != null) {
                checkModifyUserData(db, user).then(() => {
                    if (user.passwords != null) {
                        checkModifyPasswdData(db, user).then(() => {
                            resolve("both")
                        }).catch(err => {
                            reject(err)
                        })
                    } else {
                        resolve("data")
                    }
                }).catch(err => {
                    if (user.passwords != null) {
                        checkModifyPasswdData(db, user).then(() => {
                            reject(err)
                        }).catch(error => {
                            err.error["passwd"] = "Incorrect password"
                            reject(err)
                        })
                    } else {
                        reject(err)
                    }
                })
            } else {
                checkModifyPasswdData(db, user).then(() => {
                    resolve("passwd")
                }).catch(err => {
                    reject(err)
                })
            }
        }).catch((err) => {
            var error = {code: 404, error: "Not Found"}
            reject(error);
        })
       
    })
}

async function checkModifyUserData(db, user) {
    return await new Promise((resolve, reject) => {
        checkDuplicateMail(db, user.DNI, user.mail).then(() => {
            //TODO CHECK VALORES
            resolve(true)
        }).catch((err) => {
            var error = {code: 409, error: err}
            reject(error);
        })
    })
}

async function checkModifyPasswdData(db, user) {
    return await new Promise((resolve, reject) => {
        checkPassword(db, user.passwords, user.DNI).then(() => {
            //TODO CHECK VALORES
            resolve(true)
        }).catch(err => {
            var error = {code: 409, error: err}
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

async function checkPassword(db, passwords, DNI) {
    return await new Promise((resolve, reject) => {
        controlAccess.obtenerContrasenya(db, DNI).then((results) => {
            encryptor.comparePassword(passwords.actual, results[0].passwd).then(equals => {
                if (!equals) {
                    var error = {code: 409, passwd: 'Incorrect password'}
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
    checkNewUser: checkNewUser,
    checkExistentUser: checkExistentUser,
    checkModifyUser: checkModifyUser
};