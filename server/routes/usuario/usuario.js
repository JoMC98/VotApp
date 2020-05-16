const express = require('express');
const router = express.Router();
const model = require('../../models/usuario/usuario.js');

function rutado(db) {
    router.post('/nuevoUsuario', (req, res) =>  model.nuevoUsuario(db, req, res));
    router.get('/obtenerUsuario/:dni', (req, res) => model.obtenerUsuario(db, req, res));
    router.post('/modificarUsuario', (req, res) => model.modificarUsuario(db, req, res));

    return router;
}

module.exports = rutado;
