const generators = require('../../helpers/listGenerator.js');
const controlAccess = require('../acceso/controlAccessHelpers');

async function insertarOpciones(db, options, res) {
    return await new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO Opcion (codigo, opcion) VALUES ?', [options],
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
  
function obtenerOpcionesVotacion(db, req, res) {
    controlAccess.allowedUser(db, req.params.codigo, req.body.usuario.DNI, req.body.usuario.admin)
        .then(() => {
            db.query(
                'SELECT opcion FROM Opcion WHERE codigo=?', [req.params.codigo], (error, results) => {
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
                res.status(401).json({status: 'Restricted Access'});
            } else {
                res.status(500).json({status: 'error'});
            }
    
        }); 
}

function modificarOpcionesVotacion(db, req, res) {
    if (req.body.usuario.admin) {
        var options = generators.generateListOptions(req.body.codigo, req.body.opciones)
        db.query(
            'DELETE FROM Opcion WHERE codigo = ?', [req.body.codigo], 
            (error, results) => {
                if (error) {
                    res.status(500).json({status: 'error'});
                } else {
                    insertarOpciones(db, options, res).then(() => {
                        res.status(200).json({status: 'ok'});
                    });
                }
        });
    } else {
        res.status(401).json({status: 'Restricted Access'});
    }
}

module.exports = {
    insertarOpciones: insertarOpciones,
    modificarOpcionesVotacion: modificarOpcionesVotacion,
    obtenerOpcionesVotacion: obtenerOpcionesVotacion
};