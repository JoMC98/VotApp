exports.cerrarVotacionError = (db, codigo) => {
    accionCierreSockets(db, codigo).then(() => {
        accionCierreVotacion(db, codigo)
            .catch(err => {
                console.log(err)
            });
    }).catch(err => {
        console.log(err)
    });
    
}

exports.addOptionalError = (db, codigo, error) => {
    db.query(
        'UPDATE Votacion SET OptionalError=? WHERE codigo=?',
            [error, codigo],
            (error) => {
                if (error) {
                    console.log(error)
                }
        });   
}

async function accionCierreSockets(db, codigo) {
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

async function accionCierreVotacion(db, codigo) {
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

