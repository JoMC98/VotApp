const generators = require('../../helpers/listGenerator.js');
const controlAccess = require('../acceso/controlAccessHelpers.js');
const opciones = require('./opciones.js');
const participantes = require('./participantes.js');
const validator = require('../../validators/votacion.js');

exports.nuevaVotacion = (db, req, res) => {
    if (req.body.usuario.admin) {
        var votacion = req.body.datos;
        validator.checkNewVotacion(votacion)
            .then(()=> {
                res.status(200).json({status: "ok"});
                // insertVotacion(db, votacion, req.body.usuario.DNI).then(codigo => {
                //     opciones.insertarOpciones(db, codigo, req.body.opciones, res).then(() => {
                //         participantes.insertarParticipantes(db, codigo, req.body.participantes, res).then(() => {
                //             res.status(200).json({status: 'ok'});
                //         });
                //     });
                // }).catch((err) => {
                //     console.log(err)
                //     res.status(500).json({error: err});
                // })
            }).catch((err) => {
                res.status(err.code).json({error: err.error});
            })
    } else {
        res.status(403).json({status: 'Restricted Access'});
    }
}

async function insertVotacion(db, votacion, DNI_admin) {
    return await new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO Votacion (pregunta, descripcion, estado, departamento, f_votacion, ambito, DNI_admin) VALUES (?,?,"Creada",?,?,?,?)',
            [votacion.pregunta, votacion.descripcion, votacion.departamento, new Date(votacion.f_votacion), votacion.ambito, DNI_admin],
            (error, results) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    resolve(results.insertId)
                }
        });
    })
}

exports.obtenerVotacion = (db, req, res) => {
    validator.checkExistentVotacion(db, req.params.codigo)
        .then(()=> {
            controlAccess.allowedUser(db, req.params.codigo, req.body.usuario.DNI, req.body.usuario.admin)
                .then(() => {
                    db.query(
                        'SELECT codigo, pregunta, descripcion, estado, departamento, f_votacion, ambito, COUNT(DISTINCT opcion) AS opciones, COUNT(DISTINCT DNI) AS participantes FROM Votacion JOIN Opcion USING(codigo) JOIN Participa USING(codigo) WHERE codigo=?', [req.params.codigo], (error, results) => {
                            if (error) {
                                console.log(error);
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

exports.modificarVotacion = (db, req, res) => {
    if (req.body.usuario.admin) {
        validator.checkModifyVotacion(db, req.body)
            .then(()=> {
                db.query(
                'UPDATE Votacion SET pregunta=?, f_votacion=?, descripcion=?, departamento=?, ambito=? WHERE codigo=?',
                    [req.body.pregunta, new Date(req.body.f_votacion), req.body.descripcion, req.body.departamento, req.body.ambito, req.body.codigo],
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