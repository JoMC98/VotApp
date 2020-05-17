
const votacionValidator = require('./votacion.js')
const auxiliarOpt = require('./auxiliares/auxiliarOpciones.js')
const auxiliarPart = require('./auxiliares/auxiliarParticipantes.js')
const generators = require('../helpers/listGenerator.js')

async function checkNewOptions(opciones) {
    return await new Promise((resolve, reject) => {
        var res = auxiliarOpt.checkOptions(opciones)
        if (res.valid == true) {
            resolve(res.options)
        } else {
            var error = {code: 409, error: res.errors}
            reject(error)
        }
    })
}

async function checkNewParticipants(db, participantes) {
    return await new Promise((resolve, reject) => {
        auxiliarPart.checkParticipants(db, participantes).then(part => {
            resolve(part)
        }).catch(errors => {
            var error = {code: 409, error: errors}
            reject(error)
        })
    })
}

async function checkNewResultados(db, codigo, vots) {
    return await new Promise((resolve, reject) => {
        votacionValidator.checkExistentVotacion(db, codigo).then(() => {
            generators.generateListResultados(db, codigo, vots).then(votos => {
                resolve(votos)
            })
        }).catch((err) => {
            console.log(err)
            console.log("NOT EXIST ADD")
            var error = {code: 404, error: "Not Found"}
            reject(error);
        })
    })
}

module.exports = {
    checkNewOptions: checkNewOptions,
    checkNewParticipants: checkNewParticipants,
    checkNewResultados: checkNewResultados
}