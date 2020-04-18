const express = require('express');
const router = express.Router();
const model = require('../../models/acceso/sockets.js');

function rutado(db) {
    router.get('/activarVotacion/:codigo', (req, res) => model.activarVotacion(db, req, res));
    router.get('/obtenerDatosVotacion/:codigo', (req, res) => model.obtenerDatosVotacion(db, req, res));

    return router;
}

module.exports = rutado;