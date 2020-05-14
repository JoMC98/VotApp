const controlAccess = require('../acceso/controlAccessHelpers');

exports.obtenerVotaciones = (db, req, res) => {
  if (req.body.usuario.admin) {
    db.query(
      'SELECT codigo, pregunta, estado, departamento, f_votacion FROM Votacion', (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  } else {
    controlAccess.obtenerDepartamentoUsuario(db, req.body.usuario.DNI).then((departamento) => {
      db.query(
        'SELECT codigo, pregunta, estado, departamento, f_votacion, ambito, (SELECT COUNT(*) FROM Participa AS p WHERE v.codigo = p.codigo AND p.DNI = ?) AS participa ' + 
        'FROM Votacion AS v WHERE ambito = "Publica" ' +
        'OR ambito = "Privada" AND ? IN (SELECT DNI FROM Participa AS p WHERE v.codigo = p.codigo) ' +
        'OR ambito = "Departamento" AND ? = (SELECT departamento FROM Votacion AS v2 WHERE v.codigo = v2.codigo) ' +
        'OR ambito = "Oculta" AND estado = "Activa" AND ? IN (SELECT DNI FROM Participa AS p WHERE v.codigo = p.codigo)', 
        [req.body.usuario.DNI, req.body.usuario.DNI, departamento ,req.body.usuario.DNI]    
        ,(error, results) => {
          if (error) {
            console.log(error);
            res.status(500).json({status: 'error'});
          } else {
            res.status(200).json(results);
          }
        }
      );
    });
  }
}

exports.filtrarVotaciones = (db, req, res) => { 
    //TODO CHECK FILTROS?
    var pregunta = '%' + req.body.pregunta + '%';
    if (req.body.usuario.admin) {
      db.query(
        'SELECT codigo, pregunta, estado, departamento, f_votacion FROM Votacion WHERE pregunta LIKE ? AND estado IN (?) AND ambito IN (?) AND departamento IN (?)',
        [pregunta, req.body.estados, req.body.ambitos, req.body.departamentos],
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).json({status: 'error'});
          } else {
            res.status(200).json(results);
          }
        }
      ); 
    } else {
      controlAccess.obtenerDepartamentoUsuario(db, req.body.usuario.DNI).then((departamento) => {
        db.query(
          'SELECT codigo, pregunta, estado, departamento, f_votacion, ambito, (SELECT COUNT(*) FROM Participa AS p WHERE v.codigo = p.codigo AND p.DNI = ?) AS participa ' +
            'FROM Votacion AS v WHERE (ambito = "Publica" ' +
            'OR (ambito = "Privada" AND ? IN (SELECT DNI FROM Participa AS p WHERE v.codigo = p.codigo)) ' +
            'OR (ambito = "Departamento" AND ? = (SELECT departamento FROM Votacion AS v2 WHERE v.codigo = v2.codigo)) ' +
            'OR (ambito = "Oculta" AND estado = "Activa" AND ? IN (SELECT DNI FROM Participa AS p WHERE v.codigo = p.codigo))) AND ' +
            'pregunta LIKE ? AND estado IN (?) AND ambito IN (?) AND departamento IN (?)', 
          [req.body.usuario.DNI, req.body.usuario.DNI, departamento ,req.body.usuario.DNI, pregunta, req.body.estados, req.body.ambitos, req.body.departamentos],
          (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).json({status: 'error'});
            } else {
              res.status(200).json(results);
            }
          }
        ); 
      });
    }
}

exports.obtenerHomeVotaciones = (db, req, res) => { 
  if (req.body.usuario.admin) {
    db.query(
      'SELECT codigo, pregunta, estado, f_votacion FROM Votacion WHERE estado IN ("Activa", "Creada") AND f_votacion > CURRENT_DATE ORDER BY f_votacion ASC LIMIT 4',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    ); 
  } else {
    db.query(
      'SELECT codigo, pregunta, estado, f_votacion FROM Votacion AS v WHERE (? IN (SELECT DNI FROM Participa AS p WHERE v.codigo = p.codigo) AND f_votacion > CURRENT_DATE) AND ' +
      '((estado IN ("Activa", "Creada") AND ambito IN ("Publica", "Privada", "Departamento")) OR (estado = "Activa" AND ambito = "Oculta")) ORDER BY f_votacion ASC LIMIT 6',
      [req.body.usuario.DNI],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    ); 
  }
}