const controlAccess = require('../acceso/controlAccessHelpers');
const validator = require('../../validators/infoVotacion.js');
const votacionValidator = require('../../validators/votacion.js')

async function insertarParticipantes(db, codigo, participantes, res) {
    return await new Promise((resolve, reject) => {
        validator.checkNewParticipants(db, codigo, opciones)
            .then(options => {
                db.query(
                    'INSERT INTO Participa (DNI, codigo) VALUES ?', [participants],
                    (error) => {
                    if (error) {
                        res.status(500).json({status: 'error'});
                    } else {
                        resolve("ok")
                    }
                });
            }).catch((err) => {
                res.status(err.code).json({error: err.error});
            })
    });
}
  
function obtenerParticipantesVotacion(db, req, res) {
    votacionValidator.checkExistentVotacion(db, req.params.codigo)
        .then(() => {
            controlAccess.allowedUser(db, req.params.codigo, req.body.usuario.DNI, req.body.usuario.admin)
                .then(() => {
                    db.query(
                        'SELECT dni, nombre, apellidos, departamento, cargo FROM Participa JOIN Votante USING(DNI) JOIN Usuario USING(DNI) WHERE codigo=?', [req.params.codigo], (error, results) => {
                            if (error) {
                                res.status(500).json({status: 'error'});
                            } else {
                                res.status(200).json(results);
                            }
                    });      
                })
                .catch((error) => {
                    if (error == "Restricted Access") {
                        res.status(403).json({status: 'Restricted Access'});
                    } else {
                        res.status(500).json({status: 'error'});
                    }
                });  
        }).catch(err => {
            res.status(404).json({error: "Not Found"});
        })
    
}

function modificarParticipantesVotacion(db, req, res) {
    if (req.body.usuario.admin) {
        votacionValidator.checkExistentVotacion(db, req.params.codigo)
            .then(() => {
                db.query(
                    'DELETE FROM Opcion WHERE codigo = ?', [req.body.codigo], 
                    (error, results) => {
                        if (error) {
                            res.status(500).json({status: 'error'});
                        } else {
                            insertarParticipantes(db, req.body.codigo, req.body.participantes, res).then(() => {
                                res.status(200).json({status: 'ok'});
                            });
                        }
                });
            }).catch(err => {
                res.status(404).json({error: "Not Found"});
            })
    } else {
        res.status(403).json({status: 'Restricted Access'});
    }
}

module.exports = {
    insertarParticipantes: insertarParticipantes,
    obtenerParticipantesVotacion: obtenerParticipantesVotacion,
    modificarParticipantesVotacion: modificarParticipantesVotacion
};