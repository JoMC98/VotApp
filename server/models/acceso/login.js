const encryptor = require('../../helpers/passwordEncryptor.js');
const tokenController = require('../../helpers/tokenJWT.js');

exports.login = (db, req, res) => {
  db.query(
    'SELECT *, COUNT(f_autorizado) AS admin FROM Usuario LEFT JOIN Administrador USING (dni) WHERE dni = ?' , [req.body.dni], (error, results) => {
      if (error) {
        res.status(500).json({status: 'error'});
      } else {
        if (results[0].DNI == null) {
          res.status(401).json({status: 'Incorrect User or Password'});
        } else {
          encryptor.comparePassword(req.body.passwd, results[0].passwd).then(equals => {
            if (!equals) {
              res.status(401).json({status: 'Incorrect User or Password'});
            } else {
              var admin = results[0].admin == 1 ? true : false;
              tokenController.createToken(results[0].DNI, admin).then(token => {
                var response = {DNI: results[0].DNI, nombre: results[0].nombre, apellidos: results[0].apellidos, admin: admin, token: token}
                res.status(200).json(response);
              })
            }
          })
        }
      }
    }
  );
}