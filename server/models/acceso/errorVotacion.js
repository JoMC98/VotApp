var notificationsError = {}

exports.cerrarVotacionError = (db, req, res) => {
    var codigo = req.params.codigo
    if (req.body.usuario.admin) {
        accionesCierre(db, req, res)
    } 
    else {
        allowedNotification(db, codigo, req.body.usuario.DNI)
            .then((total) => {
                if (!notificationsError[codigo]) {
                    notificationsError[codigo] = {total: total, received: 1}
                } else {
                    notificationsError[codigo].received = notificationsError[codigo].received + 1;
                    if (notificationsError[codigo].received == notificationsError[codigo].total) {
                        accionesCierre(db, req, res)
                    }
                }
            })
            .catch((err) => {
                res.status(403).json({status: 'Restricted Access'});
            })
    }
}

function accionesCierre(db, req, res) {
    var codigo = req.params.codigo
    if (notificationsError[codigo]) {
        delete notificationsError[codigo];
    }
    borrarSockets(db, codigo).then(() => {
        cambiarEstadoVotacion(db, codigo).then(() => {
            //NOTIFICAR PUSH TAL VEZ DE ERROR??
            res.status(200).json({status: 'ok'});
        }).catch(err => {
            res.status(500).json({error: "error"});
        });
    }).catch(err => {
        res.status(500).json({error: "error"});
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

async function allowedNotification(db, codigo, dni) {
    return await new Promise((resolve, reject) => {
        obtenerParticipantesVotacion(db, codigo).then(results => {
            var dnis = results.map(k => k.dni)
            if (dnis.includes(dni)) {
                resolve(results.length)
            } else {
                reject(false)
            }
        }).catch(err => {
            reject(false)
        });
    });
}

async function obtenerParticipantesVotacion(db, codigo) {
    return await new Promise((resolve, reject) => {
        db.query(
            'SELECT dni FROM Participa JOIN Votante USING(DNI) WHERE codigo=?', [codigo], (error, results) => {
                if (error) {
                    reject(false)
                } else {
                    resolve(results)
                }
        });      
    });
}

async function cambiarEstadoVotacion(db, codigo, state) {
    return await new Promise((resolve, reject) => {
        db.query(
        'UPDATE Votacion SET estado="Creada", f_inicio=NULL WHERE codigo=?',
            [codigo],
            (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(true)
                }
        });   
    });
}