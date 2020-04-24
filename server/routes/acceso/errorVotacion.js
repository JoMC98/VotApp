const express = require('express');
const router = express.Router();
const model = require('../../models/acceso/errorVotacion.js');

function rutado(db) {
    router.get('/cerrarVotacionError/:codigo', (req, res) => model.cerrarVotacionError(db, req, res));    
    return router;
}

module.exports = rutado;