const express = require('express');
const router = express.Router();
const model = require('../../models/votacion/opciones.js');

function rutado(db) {
    router.get('/obtenerOpcionesVotacion/:codigo', (req, res) => model.obtenerOpcionesVotacion(db, req, res));
    router.post('/modificarOpcionesVotacion', (req, res) => model.modificarOpcionesVotacion(db, req, res));
    
    return router;
}

module.exports = rutado;