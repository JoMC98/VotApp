const encryptor = require('../../helpers/passwordEncryptor.js');
const validator = require('../../validators/password.js');

exports.modificarContraseña = async (db, passwords, DNI) => {
  return await new Promise((resolve, reject) => {
    encryptor.encryptPassword(passwords.nueva).then(hash => {
      modifyPassword(db, hash, passwords, DNI).then(() => {
        resolve(true)
      }).catch((err) => {
        reject(false)
      })
    })
  })
}
  
exports.modificarContraseñaFirst = (db, req, res) => {
    if (req.body.DNI == req.body.usuario.DNI) {
      modifyActions(db, req, res)
    } else {
      res.status(403).json({status: 'Restricted Access'});
    } 
}

function modifyActions(db, req, res) {
    validator.checkModifyPassword(db, req.body)
        .then(()=> {
            encryptor.encryptPassword(req.body.nueva).then(hash => {
                modifyPassword(db, hash, req.body, req.body.DNI).then(() => {
                  res.status(200).json({status: 'ok'});
                }).catch((err) => {
                  res.status(500).json({error: "error"});
                })
            })
        }).catch((err) => {
            res.status(err.code).json({error: err.error});
        })
}

async function modifyPassword(db, hash, passwords, DNI) {
  return await new Promise((resolve, reject) => {
    db.query(
      'UPDATE Usuario SET passwd=?, clavePublica = ?, clavePrivada = ? WHERE DNI=?',
        [hash, passwords.clavePublica, passwords.clavePrivada, DNI],
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

