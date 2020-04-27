const controlAccess = require('../acceso/controlAccessHelpers');
const sockets = require('../acceso/sockets.js');

exports.obtenerResultadosVotacion = (db, req, res) => {
  controlAccess.allowedUser(db, req.params.codigo, req.body.usuario.DNI, req.body.usuario.admin)
    .then(() => {
      sockets.obtenerEstadoVotacion(db,req.params.codigo).then(estado => {
        if (estado == "Finalizada") {
          db.query(
            'SELECT opcion, total_votos FROM Opcion WHERE codigo=?', [req.params.codigo], (error, results) => {
              if (error) {
                res.status(500).json({status: 'error'});
              } else {
                sockets.obtenerPreguntaVotacion(db, req.params.codigo).then(pregunta => {
                  var response = {pregunta: pregunta, resultados: results}
                  res.status(200).json(response);
                })
              }
            }
          );
        } else {
          res.status(403).json({status: 'Restricted Access'});
        }
      });
    })
    .catch((error) => {
      console.log(error)
        if (error == "Restricted Access") {
            res.status(403).json({status: 'Restricted Access'});
        } else {
            res.status(500).json({status: 'error'});
        }
    }); 
}

exports.addResultadosVotacion = (db, votos) => {
  console.log(votos)
  var codigo = votos[0][0]
  db.query(
    'INSERT INTO Opcion (codigo, opcion, total_votos) VALUES ? ON DUPLICATE KEY UPDATE total_votos=VALUES(total_votos)',
    [votos], (error) => {
      if (error) {
        console.log(err)
      } else {
        cambiarEstadoVotacion(db, codigo, "Finalizada")
          .then(() => {
            borrarSockets(db, codigo)
              .catch(err => {
                console.log(err)
              });
          }).catch(err => {
            console.log(err)
          });
      }
  })
}

async function cambiarEstadoVotacion(db, codigo, state) {
  return await new Promise((resolve, reject) => {
    var f = new Date(Date.now())
    db.query(
      'UPDATE Votacion SET estado=?, f_cierre=? WHERE codigo=?',
      [state, f, codigo],
      (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(true)
      }
    });   
  });
}

async function borrarSockets(db, codigo) {
  return await new Promise((resolve, reject) => {
    db.query(
      'UPDATE Participa SET temporal_socket=NULL WHERE codigo=?',
      [codigo], (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
    });   
  });
}