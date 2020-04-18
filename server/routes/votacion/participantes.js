const express = require('express');
const router = express.Router();
const model = require('../../models/votacion/participantes.js');

function rutado(db) {
    router.get('/obtenerParticipantesVotacion/:codigo', (req, res) => model.obtenerParticipantesVotacion(db, req, res));
    router.post('/modificarParticipantesVotacion', (req, res) => model.modificarParticipantesVotacion(db, req, res));
    
    return router;
}

module.exports = rutado;