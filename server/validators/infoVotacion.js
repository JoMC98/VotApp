const generators = require('../helpers/listGenerator.js');
const votacionValidator = require('./votacion.js')
const auxiliarOpt = require('./auxiliares/auxiliarOpciones.js')
const auxiliarPart = require('./auxiliares/auxiliarParticipantes.js')

async function checkNewOptions(db, codigo, opciones) {
    return await new Promise((resolve, reject) => {
        votacionValidator.checkExistentVotacion(db, codigo).then(() => {
            var res = auxiliarOpt.checkOptions(opciones)
            if (res.valid == true) {
                var options = generators.generateListOptions(codigo, res.options)
                resolve(options)
            } else {
                var error = {code: 409, error: res.errors}
                reject(error)
            }
        }).catch((err) => {
            var error = {code: 404, error: "Not Found"}
            reject(error);
        })
    })
}

async function checkNewParticipants(db, codigo, participantes) {
    return await new Promise((resolve, reject) => {
        votacionValidator.checkExistentVotacion(db, codigo).then(() => {
            auxiliarPart.checkParticipants(db, participantes).then(part => {
                var participants = generators.generateListParticipants(codigo, part)
                resolve(participants)
            }).catch(errors => {
                var error = {code: 409, error: errors}
                reject(error)
            })
        }).catch((err) => {
            var error = {code: 404, error: "Not Found"}
            reject(error);
        })
    })
}

async function checkNewResultados(db, codigo, vots) {
    return await new Promise((resolve, reject) => {
        votacionValidator.checkExistentVotacion(db, codigo).then(() => {
            //TODO CHECK RESULTADOS VALIDOS
            generators.generateListResultados(db, codigo, vots).then(votos => {
                resolve(votos)
            })
        }).catch((err) => {
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