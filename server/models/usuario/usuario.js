const mail = require('../../helpers/mailSender.js');
const validator = require('../../validators/usuario.js');
const passController = require('./password.js');

//NUEVO USUARIO
exports.nuevoUsuario = (db, req, res) => {
  if (req.body.usuario.admin) {
    var user = req.body.nuevoUsuario;
    validator.checkNewUser(db, user)
      .then(()=> {
        insertUsuario(db, user).then(() => {
          insertVotante(db, user.DNI, req.body.usuario.DNI).then(() => {
            data = {destination: user.mail, password: user.passwd, name: user.nombre, newUser: true}
            mail.sendNewMail(data)
              .then(() => {
                res.status(200).json({status: 'ok'});
              }).catch((err) => {
                res.status(500).json({error: err});
              })    
          }).catch((err) => {
            res.status(500).json({error: err});
          })
        }).catch((err) => {
          res.status(500).json({error: err});
        })  
      }).catch((err) => {
        res.status(err.code).json({error: err.error});
      })
  } else {
    res.status(403).json({status: 'Restricted Access'});
  }
}

async function insertUsuario(db, user) {
  return await new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO Usuario (DNI, nombre, apellidos, mail, telefono, passwd, departamento, cargo) VALUES (?,?,?,?,?,?,?,?)',
      [user.DNI, user.nombre, user.apellidos, user.mail, user.telefono, user.hashPasswd, user.departamento, user.cargo], (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
    });
  })
}

async function insertVotante(db, DNI, DNI_admin) {
  return await new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO Votante (DNI, DNI_admin) VALUES (?,?)',
      [DNI, DNI_admin], (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
    });
  })
}

//OBTENER USUARIO
exports.obtenerUsuario = (db, req, res) => {
  if (req.body.usuario.admin || req.params.dni == req.body.usuario.DNI) {
    validator.checkExistentUser(db, req.params.dni)
      .then(()=> {
        var tabla = {}
        if (req.body.usuario.admin && req.params.dni == req.body.usuario.DNI) {
          tabla["column"] = "f_autorizado AS f_registro"
          tabla["tabla"] = "Administrador"
        } else {
          tabla["column"] = "f_registro"
          tabla["tabla"] = "Votante"
        }
        
        db.query(
          'SELECT DNI, nombre, apellidos, mail, telefono, cargo, departamento, clavePublica, ' + tabla.column + ' FROM Usuario JOIN ' + tabla.tabla + ' USING(dni) WHERE dni = ?' , 
          [req.params.dni], (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).json({status: 'error'});
            } else {
              res.status(200).json(results);
            }
        }); 
      }).catch(err => {
        res.status(404).json({error: "Not Found"});
      })
  } else {
    res.status(403).json({status: 'Restricted Access'});
  }
}

exports.modificarUsuario = (db, req, res) => {
  if (req.body.usuario.admin || req.body.DNI == req.body.usuario.DNI) {
    validator.checkModifyUser(db, req.body)
      .then(r => {
        if (r == "both") {
          modifyUserAction(db, req.body).then(() => {
            passController.modificarContraseña(db, req.body.passwords, req.body.DNI).then(() => {
              res.status(200).json({status: 'ok'});
            }).catch((err) => {
              res.status(500).json({status: 'error'});
            }) 
          }).catch(() => {
            res.status(500).json({status: 'error'});
          })
        } else if (r == "data") {
          modifyUserAction(db, req.body).then(() => {
            res.status(200).json({status: 'ok'});
          }).catch((err) => {
            res.status(500).json({status: 'error'});
          }) 
        } else {
          passController.modificarContraseña(db, req.body.passwords, req.body.DNI).then(() => {
            res.status(200).json({status: 'ok'});
          }).catch((err) => {
            res.status(500).json({status: 'error'});
          }) 
        }
      }).catch((err) => {
        res.status(err.code).json({error: err.error});
      })
  } else {
    res.status(403).json({status: 'Restricted Access'});
  } 
}

async function modifyUserAction(db, user) {
  return await new Promise((resolve, reject) => {
    db.query(
      'UPDATE Usuario SET nombre=?, apellidos=?, telefono=?, mail=?, cargo=?, departamento=? WHERE DNI=?',
          [user.nombre, user.apellidos, user.telefono, user.mail, user.cargo, user.departamento, user.DNI],
          (error) => {
          if (error) {
            console.error(error);
            reject(false)
          } else {
            resolve(true)
          }
      })
  })
}
