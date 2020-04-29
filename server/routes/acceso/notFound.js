const express = require('express');
const router = express.Router();

function rutado() {
    router.use('*', function(req,res){
        res.status(404).json({error: "Not Found"});
    })

    return router;
}

module.exports = rutado;

