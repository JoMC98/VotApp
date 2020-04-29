const express = require('express');
const router = express.Router();
const model = require('../../models/usuario/password.js');

function rutado(db) {
    router.post('/modificarContrasenya', (req, res) => model.modificarContraseña(db, req, res));
    router.post('/modificarContrasenyaFirst', (req, res) => model.modificarContraseñaFirst(db, req, res));

    return router;
}

module.exports = rutado;
