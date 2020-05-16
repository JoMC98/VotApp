const generalValidator = require('../general.js')
const departamentos = require('../../public/assets/files/departamentos.json')
const ambitos = require('../../public/assets/files/ambitos.json')

exports.checkNewVotacion = (votacion) => {
    var errors = {}
    generalValidator.checkRequired("pregunta", votacion.pregunta, errors)
    checkDepartamento(votacion.departamento, errors)
    generalValidator.checkRequired("f_votacion", votacion.f_votacion, errors)
    generalValidator.checkRequired("ambito", votacion.ambito, errors)

    if (Object.keys(errors).length == 0) {
        return true
    } else {
        return errors
    }
}

function checkDepartamento(departamento, errors) {
    if (generalValidator.checkRequired("departamento", departamento, errors)) {
        console.log(departamentos)
    }
}

function checkAmbito(ambito, errors) {
    
}

function checkFecha(fecha, errors) {
    
}