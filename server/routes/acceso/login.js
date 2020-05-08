const express = require('express');
const router = express.Router();
const model = require('../../models/acceso/login.js');

function rutado(db) {
    router.post('/login', (req, res) => {
        model.login(db, req, res);  

    })

    return router;
}

module.exports = rutado;