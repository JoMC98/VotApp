const express = require('express');
const router = express.Router();
const model = require('../../models/usuario/usuarios.js');

function rutado(db) {
    router.get('/obtenerUsuarios', (req, res) => model.obtenerUsuarios(db, req, res));
    router.post('/filtrarUsuarios', (req, res) => model.filtrarUsuarios(db, req, res));
    router.post('/obtenerUsuariosFueraVotacion', (req, res) => model.obtenerUsuariosFueraVotacion(db, req, res));
    
    return router;
}

module.exports = rutado;