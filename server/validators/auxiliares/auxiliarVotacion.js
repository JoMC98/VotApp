const generalValidator = require('../general.js')
const dptos = require('../../public/assets/files/departamentos.json')
const departamentos = Object.keys(dptos)
const ambitos = require('../../public/assets/files/ambitos.json').ambitos

exports.checkNewVotacion = (votacion) => {
    var errors = {}
    generalValidator.checkRequired("pregunta", votacion.pregunta, errors)
    checkDepartamento(votacion.departamento, errors)
    checkAmbito(votacion.ambito, errors)
    checkFecha(votacion.f_votacion, errors)

    if (Object.keys(errors).length == 0) {
        return true
    } else {
        return errors
    }
}

function checkDepartamento(departamento, errors) {
    if (generalValidator.checkRequired("departamento", departamento, errors)) {
        if (!departamentos.includes(departamento)) {
            errors["departamento"] = "notValid"
        }
    }
}

function checkAmbito(ambito, errors) {
    if (generalValidator.checkRequired("ambito", ambito, errors)) {
        if (!ambitos.includes(ambito)) {
            errors["ambito"] = "notValid"
        }
    }
}

function checkFecha(fecha, errors) {
    if (generalValidator.checkRequired("f_votacion", fecha, errors)) {
        var f = new Date(fecha)
        var now = new Date()
        now.setHours(00, 00, 00)
        if (f < now || f.getDay() == 6 || f.getDay() == 0) {
            errors["f_votacion"] = "notValid"
        }
    }
}