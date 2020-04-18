const express = require('express');
const router = express.Router();
const model = require('../../models/votacion/votacion.js');

function rutado(db) {
    router.post('/nuevaVotacion', (req, res) => model.nuevaVotacion(db, req, res));
    router.get('/obtenerVotacion/:codigo', (req, res) => model.obtenerVotacion(db, req, res));
    router.post('/modificarVotacion', (req, res) => model.modificarVotacion(db, req, res));
    
    return router;
}

module.exports = rutado;