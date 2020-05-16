const tokenController = require('../helpers/tokenJWT.js');
const bodyParser = require('body-parser');

exports.verificaToken = (req, res, next) => {
    if (req.url == "/login") {
        next()
    }
    else {
        tokenController.checkToken(req)
            .then(result => {
                req.body.usuario = result;
                next();
            }).catch(err => {
                res.status(401).json({status: err});
            })
    }
}

exports.verificaJSON = (err, req, res, next) => {
    if (err) {
        res.status(400).send({error: "Error Parsing JSON"})
    } else {
        next()
    }
}