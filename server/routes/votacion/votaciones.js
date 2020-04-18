const express = require('express');
const router = express.Router();
const model = require('../../models/votacion/votaciones.js');


function rutado(db) {
    router.get('/obtenerVotaciones', (req, res) => model.obtenerVotaciones(db, req, res));
    router.post('/filtrarVotaciones', (req, res) => model.filtrarVotaciones(db, req, res));
    router.get('/obtenerHomeVotaciones', (req, res) => model.obtenerHomeVotaciones(db, req, res));
    
return router;
}

module.exports = rutado;