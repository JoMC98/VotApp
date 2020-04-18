const generators = require('../../helpers/listGenerator.js');
const controlAccess = require('../acceso/controlAccessHelpers');

async function insertarParticipantes(db, participants, res) {
    return await new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO Participa (DNI, codigo) VALUES ?', [participants],
            (error) => {
            if (error) {
                console.error(error);
                res.status(500).json({status: 'error'});
            } else {
                resolve("ok")
            }
        });
    });
}
  
function obtenerParticipantesVotacion(db, req, res) {
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
                res.status(401).json({status: 'Restricted Access'});
            } else {
                res.status(500).json({status: 'error'});
            }
        }); 
}

function modificarParticipantesVotacion(db, req, res) {
    if (req.body.usuario.admin) {
        var participants = generators.generateListParticipants(req.body.codigo, req.body.participantes)
        db.query(
            'DELETE FROM Participa WHERE codigo = ?', [req.body.codigo], 
                (error, results) => {
                    if (error) {
                        res.status(500).json({status: 'error'});
                    } else {
                        insertarParticipantes(db, participants, res).then(() => {
                            res.status(200).json({status: 'ok'});
                        });
                    }
                }
        );
    } else {
        res.status(401).json({status: 'Restricted Access'});
    }
}

module.exports = {
    insertarParticipantes: insertarParticipantes,
    obtenerParticipantesVotacion: obtenerParticipantesVotacion,
    modificarParticipantesVotacion: modificarParticipantesVotacion
};