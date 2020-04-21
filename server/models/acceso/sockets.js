const portController = require('../../sockets/portController.js');
const votacionController = require('../../sockets/votacionController.js');
const pushController = require('../../helpers/pushController.js');

function activarVotacion(db, req, res) {
  if (req.body.usuario.admin) {
    var codigo = req.params.codigo
    obtenerEstadoVotacion(db,codigo).then(estado => {
      // if (estado == "Creada") {
      if (true) {
        obtenerParticipantesVotacion(db, codigo, req.body.usuario.DNI).then(result => {
          portController.obtenerListaPuertos(result).then((listVotantes) => {
            votacionController.iniciarVotacion(listVotantes).then((ports) => {
              storePortsVotantes(db, ports, codigo).then(() => {
                var dnis = ports.votantes.map(arr => arr[0])
                pushController.sendNotification(dnis)
                  .then(() => {
                    obtenerClavePrivada(db, req.body.usuario.DNI).then(clavePrivada => {
                      res.status(200).json({"portAdmin": ports.admin, "pregunta": result.pregunta, "clavePrivada" : clavePrivada, participantes: result.participantes.length});
                    })
                  }).catch((err) => {
                    res.status(500).json({error: err});
                  })
              }).catch(err => {
                res.status(500).json({status: err});
              })
            })
          }).catch(err => {
            if (err == "Wait") {
              res.status(500).json({status: "All Ports Busy"});
            } else {
              res.status(500).json({status: err});
            }
          })
        })
      } else {
        res.status(401).json({status: 'Restricted Access'});
      }
    })
      
  } else {
    res.status(401).json({status: 'Restricted Access'});
  }
  
  //res.status(200).json({status: 'ok'});

  // db.query(
  //   //GET SOCKET--> GET votacion
  // );
}

async function storePortsVotantes(db, ports, codigo) {
  return await new Promise((resolve, reject) => {
    ports.votantes.forEach(us => {
      us.splice(1, 0, codigo);
    });
    db.query(
      'INSERT INTO Participa (DNI, codigo, temporal_socket) VALUES ? ON DUPLICATE KEY UPDATE temporal_socket=VALUES(temporal_socket)',
      [ports.votantes],
      (error) => {
        if (error) {
          reject(error)
        } else {
          cambiarEstadoVotacion(db, codigo, "Activa")
            .then(() => {
              resolve(true)
            }).catch(err => {
              reject(err)
            });
        }
    });   
  });
}

async function obtenerEstadoVotacion(db, codigo) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT estado FROM Votacion WHERE codigo=?',
      [codigo],
      (error, results) => {
      if (error) {
        reject(error)
      } else {
        resolve(results[0].estado)
      }
    });   
  });
}

async function cambiarEstadoVotacion(db, codigo, state) {
  return await new Promise((resolve, reject) => {
    var f = new Date(Date.now())
    db.query(
      'UPDATE Votacion SET estado=?, f_inicio=? WHERE codigo=?',
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

async function obtenerParticipantesVotacion(db, codigo, DNI_admin) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT dni, clavePublica, VPN_IP FROM Participa JOIN Votante USING(DNI) JOIN Usuario USING(DNI) WHERE codigo=?', [codigo], 
      (error, results) => {
        if (error) {
          reject(error)
        } else {
          db.query(
            'SELECT clavePublica, VPN_IP FROM Usuario WHERE dni=?', [DNI_admin], (error, result) => {
              if (error) {
                reject(error)
              } else {
                obtenerPreguntaVotacion(db, codigo).then(pregunta => {
                  var res = {participantes: results, admin: result[0], pregunta: pregunta}
                  resolve(res);
                })
              }
          });
        }
    });
  });
}

async function obtenerPreguntaVotacion(db, codigo) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT pregunta FROM Votacion WHERE codigo=?', [codigo], (error, resultado) => {
        if (error) {
          reject(error)
        } else {
          resolve(resultado[0].pregunta)
        }
    });
  });
}

async function obtenerClavePrivada(db, DNI) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT clavePrivada FROM Usuario WHERE DNI=?', [DNI], 
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result[0].clavePrivada)
        }
    });
  });
}

function obtenerDatosVotacion(db, req, res) {
  if (!req.body.usuario.admin) {
    var codigo = req.params.codigo
    obtenerEstadoVotacion(db,codigo).then(estado => {
      if (estado == "Activa") {
        obtenerDNIParticipantesVotacion(db, codigo).then(participantes => {
          if (participantes.includes(req.body.usuario.DNI)) {
            obtenerClavePrivadaSocket(db, codigo, req.body.usuario.DNI).then((data) => {
              res.status(200).json(data);
            })
          } else {
            res.status(401).json({status: 'Restricted Access'});
          }
        }).catch(err => {
          res.status(500).json({error: err})
        })
      } else {
        res.status(401).json({status: 'Restricted Access'});
      }
    })
  } else {
    res.status(401).json({status: 'Restricted Access'});
  }
}

async function obtenerDNIParticipantesVotacion(db, codigo) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT dni FROM Participa WHERE codigo=?', [codigo], 
      (error, results) => {
        if (error) {
          reject(error)
        } else {
          var res = results.map(r => r.dni)
          resolve(res)
        }
    });
  });
}

async function obtenerClavePrivadaSocket(db, codigo, DNI) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT temporal_socket FROM Participa WHERE DNI=? AND codigo=?', [DNI, codigo], 
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          obtenerClavePrivada(db, DNI).then(clavePrivada => {
            var res = {socketPort: result[0].temporal_socket, clavePrivada: clavePrivada}
            obtenerPreguntaVotacion(db, codigo).then(pregunta => {
              res["pregunta"] = pregunta;
              resolve(res);
            }).catch(err => {
              reject(err)
            });
          }).catch(err => {
            reject(err)
          });
        }
    });
  });
}

module.exports = {
  activarVotacion : activarVotacion,
  obtenerDatosVotacion : obtenerDatosVotacion,
  obtenerPreguntaVotacion: obtenerPreguntaVotacion,
  obtenerEstadoVotacion: obtenerEstadoVotacion
};