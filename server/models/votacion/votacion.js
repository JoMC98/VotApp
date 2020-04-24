const generators = require('../../helpers/listGenerator.js');
const controlAccess = require('../acceso/controlAccessHelpers.js');
const opciones = require('./opciones.js');
const participantes = require('./participantes.js');

exports.nuevaVotacion = (db, req, res) => {
    //TODO CHECK VALORES y AMBITO; DPTO en LISTA
    if (req.body.usuario.admin) {
        var votacion = req.body.datos;
        db.query(
            'INSERT INTO Votacion (pregunta, descripcion, estado, departamento, f_votacion, ambito, DNI_admin) VALUES (?,?,"Creada",?,?,?,?)',
            [votacion.pregunta, votacion.descripcion, votacion.departamento, new Date(votacion.f_votacion), votacion.ambito, req.body.usuario.DNI],
            (error, results) => {
                if (error) {
                    res.status(500).json({status: 'error'});
                } else {
                    var codigo = results.insertId;
                    var options = generators.generateListOptions(codigo, req.body.opciones)
                    opciones.insertarOpciones(db, options, res).then(() => {
                        var participants = generators.generateListParticipants(codigo, req.body.participantes)
                        participantes.insertarParticipantes(db, participants, res).then(() => {
                            res.status(200).json({status: 'ok'});
                        });
                    });
                }
            }
        );
    } else {
        res.status(403).json({status: 'Restricted Access'});
    }
}

exports.obtenerVotacion = (db, req, res) => {
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
}

exports.modificarVotacion = (db, req, res) => {
    if (req.body.usuario.admin) {
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
            }
        );
    } else {
        res.status(403).json({status: 'Restricted Access'});
    }
}