const mail = require('../../helpers/mailSender.js');
const validator = require('../../validators/usuario.js');

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
          'SELECT DNI, nombre, apellidos, mail, telefono, cargo, departamento, ' + tabla.column + ' FROM Usuario JOIN ' + tabla.tabla + ' USING(dni) WHERE dni = ?' , 
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
      .then(()=> {
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
        });
      }).catch((err) => {
        res.status(err.code).json({error: err.error});
      })
  } else {
    res.status(403).json({status: 'Restricted Access'});
  } 
}


