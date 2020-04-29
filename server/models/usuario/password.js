const encryptor = require('../../helpers/passwordEncryptor.js');
const validator = require('../../validators/password.js');

exports.modificarContraseña = (db, req, res) => {
    if (req.body.usuario.admin || req.body.DNI == req.body.usuario.DNI) {
        modifyActions(db, req, res, false)
    } else {
        res.status(403).json({status: 'Restricted Access'});
    } 
}
  
exports.modificarContraseñaFirst = (db, req, res) => {
    if (req.body.DNI == req.body.usuario.DNI) {
        modifyActions(db, req, res, true)
    } else {
        res.status(403).json({status: 'Restricted Access'});
    } 
}

function modifyActions(db, req, res, first) {
    validator.checkModifyPassword(db, req.body, first)
        .then(()=> {
            encryptor.encryptPassword(req.body.nueva).then(hash => {
                modifyPassword(db, hash, req.body).then(() => {
                    res.status(200).json({status: 'ok'});
                }).catch((err) => {
                    res.status(500).json({error: "error"});
                })
            })
        }).catch((err) => {
            res.status(err.code).json({error: err.error});
        })
}

async function modifyPassword(db, hash, body) {
  return await new Promise((resolve, reject) => {
    db.query(
      'UPDATE Usuario SET passwd=?, clavePublica = ?, clavePrivada = ? WHERE DNI=?',
        [hash, body.clavePublica, body.clavePrivada, body.DNI],
        (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      }
    );
  })
}

