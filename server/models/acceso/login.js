const tokenController = require('../../helpers/tokenJWT.js');
const validator = require('../../validators/login.js');

exports.login = (db, req, res) => {
    validator.checkLogin(db, req.body).then(user => {
        var admin = user.admin == 1 ? true : false;
        tokenController.createToken(user.DNI, admin, false).then(token => {
            var changePasswd = false;
            if (user.clavePublica == null || user.clavePrivada == null) {
                changePasswd = true;
            }
            var response = {DNI: user.DNI, nombre: user.nombre, apellidos: user.apellidos, admin: admin, token: token, changePasswd: changePasswd}
            res.status(200).json(response);
        })
    }).catch((err) => {
        res.status(err.code).json({error: err.error});
    })
}
