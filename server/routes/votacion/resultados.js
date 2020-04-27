const express = require('express');
const router = express.Router();
const model = require('../../models/votacion/resultados.js');


function rutado(db) {
    router.get('/obtenerResultadosVotacion/:codigo', (req, res) => model.obtenerResultadosVotacion(db, req, res));  
    
    return router;
}

module.exports = rutado;