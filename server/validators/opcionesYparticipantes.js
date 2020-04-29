const generators = require('../helpers/listGenerator.js');
const votacionValidator = require('./votacion.js')

async function checkNewOptions(db, codigo, opciones) {
    return await new Promise((resolve, reject) => {
        votacionValidator.checkExistentVotacion(db, codigo).then(() => {
            //TODO CHECK VALORES, opciones distintas, minimo de opciones y maximo, etc
            var options = generators.generateListOptions(codigo, opciones)
            resolve(options)
        }).catch((err) => {
            var error = {code: 404, error: "Not Found"}
            reject(error);
        })
    })
}

async function checkNewParticipants(db, codigo, participantes) {
    return await new Promise((resolve, reject) => {
        votacionValidator.checkExistentVotacion(db, codigo).then(() => {
            //TODO CHECK VALORES, participantes minimos, maximos, dnis validos existentes usar checkExistentUsuario, etc
            var participants = generators.generateListParticipants(codigo, participantes)
            resolve(participants)
            
        }).catch((err) => {
            var error = {code: 404, error: "Not Found"}
            reject(error);
        })
    })
}

module.exports = {
    checkNewOptions: checkNewOptions,
    checkNewParticipants: checkNewParticipants
}