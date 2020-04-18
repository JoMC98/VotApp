const express = require('express');
const router = express.Router();
const model = require('../../models/usuario/usuario.js');
const encryptor = require('../../helpers/passwordEncryptor.js');

function rutado(db) {
    router.post('/nuevoUsuario', (req, res) => {
        encryptor.encryptPassword(req.body.nuevoUsuario.passwd).then(hash => {
            req.body.nuevoUsuario.hashPasswd = hash
            model.nuevoUsuario(db, req, res)
        })
    });
    router.get('/obtenerUsuario/:dni', (req, res) => model.obtenerUsuario(db, req, res));
    router.post('/modificarUsuario', (req, res) => model.modificarUsuario(db, req, res));
    router.post('/modificarContrasenya', (req, res) => model.modificarContraseña(db, req, res));

    return router;
}

module.exports = rutado;
