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


async function obtenerParticipantesVotacion(db, codigo, DNI_admin) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT dni, clavePublica, VPN_IP FROM Participa JOIN Votante USING(DNI) JOIN Usuario USING(DNI) WHERE codigo=?', [codigo], 
      (error, results) => {
        if (error) {
          reject(error)
        } else {
          getUsuarioDatos(db, DNI_admin)
            .then(response => {
              var res = {participantes: results, admin: response}
              resolve(res)
            }).catch(err => {
              reject(error)
            })
        }
    });
  });
}

async function obtenerClavePrivadaSocket(db, codigo, DNI) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT temporal_socket FROM Participa WHERE DNI=? AND codigo=?', [DNI, codigo], 
      (error, resultado) => {
        if (error) {
          reject(error)
        } else {
          getUsuarioDatos(db, DNI).then(result => {
            var res = {socketPort: resultado[0].temporal_socket, clavePrivada: result.clavePrivada}
            getVotacionDatos(db, codigo).then(datos => {
              res["pregunta"] = datos.pregunta;
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

async function getVotacionDatos(db, codigo) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT pregunta, estado, OptionalError FROM Votacion WHERE codigo=?',
      [codigo],
      (error, results) => {
      if (error) {
        reject(error)
      } else {
        resolve(results[0])
      }
    });   
  });
}

async function getUsuarioDatos(db, DNI) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT clavePrivada, clavePublica, VPN_IP FROM Usuario WHERE DNI=?', [DNI], 
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result[0])
        }
    });
  });
}



module.exports = {
    storePortsVotantes: storePortsVotantes,
    getVotacionDatos: getVotacionDatos,
    getUsuarioDatos: getUsuarioDatos,
    obtenerClavePrivadaSocket: obtenerClavePrivadaSocket,
    obtenerParticipantesVotacion: obtenerParticipantesVotacion,
    obtenerDNIParticipantesVotacion: obtenerDNIParticipantesVotacion
}