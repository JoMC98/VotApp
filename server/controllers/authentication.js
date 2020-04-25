const tokenController = require('../helpers/tokenJWT.js');

exports.verificaToken = (req, res, next) => {
    if (req.url == "/login") {
        next()
    } else {
        tokenController.checkToken(req)
            .then(result => {
                req.body.usuario = result;
                next();
            }).catch(err => {
                res.status(401).json({status: err});
            })
    }
}