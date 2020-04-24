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
    db.query(
      'SELECT DNI, nombre, apellidos, mail, telefono, cargo, departamento, f_registro FROM Usuario JOIN Votante USING(dni) WHERE dni = ?' , [req.params.dni], (error, results) => {
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
              'UPDATE Usuario SET passwd=? WHERE DNI=?',
                [hash, req.body.DNI],
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
