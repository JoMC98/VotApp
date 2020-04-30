const portController = require('../../sockets/serverController.js');
const votacionController = require('../../sockets/votacionController.js');
const pushController = require('../../helpers/pushController.js');
const tokenController = require('../../helpers/tokenJWT.js');
const auxiliarVotacion = require('./auxiliarVotacion');
const votacionValidator = require('../../validators/votacion.js')

function privateKeyAdmin(db, req, res) {
    var codigo = req.params.codigo
    if (req.body.usuario.admin) {
        votacionValidator.checkExistentVotacion(db, codigo).then(() => {
            auxiliarVotacion.getUsuarioDatos(db, req.body.usuario.DNI).then(result => {
                auxiliarVotacion.getVotacionDatos(db, codigo).then(datos => {
                    res.status(200).json({clavePrivada: result.clavePrivada, pregunta: datos.pregunta, estado: datos.estado, error: datos.OptionalError});
                })
            })
        }).catch((err) => {
            res.status(404).json({status: 'Not Found'});
        })
    } else {
        res.status(403).json({status: 'Restricted Access'});
    }
}

function activarVotacion(db, req, res) {
  if (req.body.usuario.admin) {
    var codigo = req.params.codigo
    votacionValidator.checkExistentVotacion(db, codigo).then(() => {
      auxiliarVotacion.getVotacionDatos(db, codigo).then(datos => {
        if (datos.estado == "Creada") {
          auxiliarVotacion.obtenerParticipantesVotacion(db, codigo, req.body.usuario.DNI) .then(result => {
            portController.obtenerListaPuertos(result).then((listVotantes) => {
              votacionController.iniciarVotacion(listVotantes, codigo).then((ports) => {
                iniciarVotacion(db, codigo, req.body.usuario.DNI, ports).then(token => {
                  res.status(200).json({"portAdmin": ports.admin, "participantes": result.participantes.length, "token": token});
                }).catch((err) => {
                  console.log(err)
                  res.status(500).json(err);
                })
              })
            }).catch(err => {
              if (err == "Wait") {
                res.status(406).json({status: 'All Ports Busy'});
              } else {
                res.status(500).json(err);
              }
            })
          })
        } else {
          res.status(403).json({status: 'Restricted Access'});
        }
      })
    }).catch((err) => {
      res.status(404).json({status: 'Not Found'});
    })  
  } else {
    res.status(403).json({status: 'Restricted Access'});
  }
}

async function iniciarVotacion(db, codigo, DNI, ports) {
  return await new Promise((resolve, reject) => {
    auxiliarVotacion.storePortsVotantes(db, ports, codigo).then(() => {
      pushController.sendNotification(ports.votantes.map(arr => arr[0])).then(() => {
        tokenController.createToken(DNI, true, true).then(token => {
          resolve(token)
        }).catch(err => {
          reject({error: err})
        })
      }).catch((err) => {
        reject({error: err})
      })
    }).catch((err) => {
      reject({error: err})
    })
  })
}


function obtenerEstadoVotacionVotante(db, req, res) {
  var codigo = req.params.codigo;
  votacionValidator.checkExistentVotacion(db, codigo).then(() => {
    auxiliarVotacion.getVotacionDatos(db, codigo).then(datos => {
      if (req.body.usuario.admin) {
        res.status(200).json({estado: datos.estado, pregunta: datos.pregunta});
      } else {
        auxiliarVotacion.obtenerDNIParticipantesVotacion(db, codigo).then(dnis => {
          if (dnis.includes(req.body.usuario.DNI)) {
            res.status(200).json({estado: datos.estado, pregunta: datos.pregunta, error: datos.OptionalError});
          } else {
            res.status(403).json({status: 'Restricted Access'});
          }
        })
      }
    })
  }).catch((err) => {
    res.status(404).json({status: 'Not Found'});
  })
}

function obtenerDatosVotacion(db, req, res) {
  if (!req.body.usuario.admin) {
    var codigo = req.params.codigo
    votacionValidator.checkExistentVotacion(db, codigo).then(() => {
      auxiliarVotacion.getVotacionDatos(db, codigo).then(datos => {
        if (datos.estado == "Activa") {
          auxiliarVotacion.obtenerDNIParticipantesVotacion(db, codigo).then(participantes => {
            if (participantes.includes(req.body.usuario.DNI)) {
              auxiliarVotacion.obtenerClavePrivadaSocket(db, codigo, req.body.usuario.DNI).then((data) => { 
                tokenController.createToken(req.body.usuario.DNI, true, true).then(token => {
                  data["token"] = token;
                  res.status(200).json(data);
                })
              })
            } else {
              res.status(403).json({status: 'Restricted Access'});
            }
          }).catch(err => {
            console.log(error)
            res.status(500).json({error: err})
          })
        } else {
          res.status(403).json({status: 'Restricted Access'});
        }
      })
    }).catch((err) => {
      res.status(404).json({status: 'Not Found'});
    })
  } else {
    res.status(403).json({status: 'Restricted Access'});
  }
}

module.exports = {
  activarVotacion : activarVotacion,
  privateKeyAdmin: privateKeyAdmin,
  obtenerDatosVotacion : obtenerDatosVotacion,
  obtenerEstadoVotacionVotante: obtenerEstadoVotacionVotante
}