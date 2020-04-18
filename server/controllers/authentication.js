const tokenController = require('../helpers/tokenJWT.js');

exports.verificaToken = (req, res, next) => {
    if (req.url == "/login") {
        next()
    } else {
        tokenController.checkToken(req, res).then(result => {
            req.body.usuario = result;
            next();
        })
    }
}