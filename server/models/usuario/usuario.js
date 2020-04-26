const encryptor = require('../../helpers/passwordEncryptor.js');
const controlAcces = require('../acceso/controlAccessHelpers.js');
const mail = require('../../helpers/mailSender.js');

// USUARIO

//INSERT
exports.nuevoUsuario = (db, req, res) => {
  //TODO CHECK VALORES
  if (req.body.usuario.admin) {
    var user = req.body.nuevoUsuario;
    db.query(
      'INSERT INTO Usuario (DNI, nombre, apellidos, mail, telefono, passwd, departamento, cargo) VALUES (?,?,?,?,?,?,?,?)',
      [user.DNI, user.nombre, user.apellidos, user.mail, user.telefono, user.hashPasswd, user.departamento, user.cargo],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({status: 'error'});
        } else {
          db.query(
            'INSERT INTO Votante (DNI, DNI_admin) VALUES (?,?)',
            [user.DNI, req.body.usuario.DNI],
            (error) => {
              if (error) {
                console.error(error);
                res.status(500).json({status: 'error'});
              } else {

                //SEND MAIL
                data = {destination: user.mail, password: user.passwd, name: user.nombre, newUser: true}
                mail.sendNewMail(data)
                    .then(() => {
                      res.status(200).json({status: 'ok'});
                    }).catch((err) => {
                      res.status(500).json({error: err});
                    })    
              }
            }
          );
        }
      }
    );
  } else {
    res.status(403).json({status: 'Restricted Access'});
  }
}

//GET
exports.obtenerUsuario = (db, req, res) => {
  if (req.body.usuario.admin || req.params.dni == req.body.usuario.DNI) {
    var tabla = {}
    if (req.body.usuario.admin && req.params.dni == req.body.usuario.DNI) {
      tabla["column"] = "f_autorizado AS f_registro"
      tabla["tabla"] = "Administrador"
    } else {
      tabla["column"] = "f_registro"
      tabla["tabla"] = "Votante"
    }
    db.query(
      'SELECT DNI, nombre, apellidos, mail, telefono, cargo, departamento, ' + tabla.column + ' FROM Usuario JOIN ' + tabla.tabla + ' USING(dni) WHERE dni = ?' , 
      [req.params.dni], (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    ); 
  } else {
    res.status(403).json({status: 'Restricted Access'});
  }
}

//UPDATE
exports.modificarUsuario = (db, req, res) => {
  if (req.body.usuario.admin || req.body.DNI == req.body.usuario.DNI) {
    db.query(
      'UPDATE Usuario SET nombre=?, apellidos=?, telefono=?, mail=?, cargo=?, departamento=? WHERE DNI=?',
          [req.body.nombre, req.body.apellidos, req.body.telefono, req.body.mail, req.body.cargo, req.body.departamento, req.body.DNI],
          (error) => {
          if (error) {
              console.error(error);
              res.status(500).json({status: 'error'});
          } else {
              res.status(200).json({status: 'ok'});
          }
      }
    );
  } else {
    res.status(403).json({status: 'Restricted Access'});
  } 
}


// PASSWORD

//UPDATE
exports.modificarContraseña = (db, req, res) => {
  if (req.body.usuario.admin || req.body.DNI == req.body.usuario.DNI) {
    controlAcces.obtenerContrasenya(db, req.body.DNI).then((results) => {
      encryptor.comparePassword(req.body.actual, results[0].passwd).then(equals => {
        if (!equals) {
          res.status(403).json({status: 'Incorrect Password'});
        } else {
          encryptor.encryptPassword(req.body.nueva).then(hash => {
            db.query(
              'UPDATE Usuario SET passwd=?, clavePublica = ?, clavePrivada = ? WHERE DNI=?',
              [hash, req.body.clavePublica, req.body.clavePrivada, req.body.DNI],
                (error) => {
                if (error) {
                  console.error(error);
                  res.status(500).json({status: 'error'});
                } else {
                  res.status(200).json({status: 'ok'});
                }
              }
            );
          })
        }
      })
    });
  } else {
    res.status(403).json({status: 'Restricted Access'});
  } 
}

exports.modificarContraseñaFirst = (db, req, res) => {
  if (req.body.DNI == req.body.usuario.DNI) {
    
    checkFirstPassword(db, req.body.usuario.DNI).then(response => {
      if (response) {
        encryptor.encryptPassword(req.body.password).then(hash => {
          db.query(
            'UPDATE Usuario SET passwd=?, clavePublica = ?, clavePrivada = ? WHERE DNI=?',
              [hash, req.body.clavePublica, req.body.clavePrivada, req.body.DNI],
              (error) => {
              if (error) {
                console.error(error);
                res.status(500).json({status: 'error'});
              } else {
                res.status(200).json({status: 'ok'});
              }
            }
          );
        })
      } else {
        res.status(403).json({status: 'Restricted Access'});
      }
    }).catch(err => {
      res.status(500).json({status: 'error'});
    })
}

async function checkFirstPassword(db, DNI) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT clavePublica, clavePrivada FROM Usuario WHERE dni = ?', 
      [DNI], (error, results) => {
        if (error) {
          reject(false)
        } else {
          if (results[0].clavePublica == null || results[0].clavePrivada == null) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    })
  }
}
