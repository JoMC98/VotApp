const dptos = require('../../public/assets/files/departamentos.json')
const listaDepartamentos = Object.keys(dptos)

exports.obtenerUsuarios = (db, req, res) => {
  if (req.body.usuario.admin) {
    db.query(
      'SELECT dni, nombre, apellidos, departamento, cargo FROM Usuario JOIN Votante USING(dni)' , (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    ); 
  } else {
    res.status(403).json({status: 'Restricted Access'});
  }
}
  
exports.filtrarUsuarios = (db, req, res) => { 
  if (req.body.usuario.admin) {
    var nombre = req.body.nombre ? '%' + req.body.nombre + '%' : '%%'
    var apellidos = req.body.apellidos ? '%' + req.body.apellidos + '%' : '%%'
    var cargo = req.body.cargo ? '%' + req.body.cargo + '%' : '%%'
    var departamentos = !req.body.departamentos || req.body.departamentos.length == 0 ? listaDepartamentos : req.body.departamentos
    db.query(
      'SELECT dni, nombre, apellidos, departamento, cargo FROM Usuario JOIN Votante USING(dni) WHERE nombre LIKE ? AND apellidos LIKE ? AND cargo LIKE ? AND departamento IN (?)', 
      [nombre, apellidos, cargo, departamentos],
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
    res.status(403).json({status: 'Restricted Access'});
  }
}
  
exports.obtenerUsuariosFueraVotacion = (db, req, res) => {
  if (req.body.usuario.admin) {
    var participantes = req.body.participantes;
    if (!participantes) {
      participantes = [];
    }
    if (participantes.length == 0) {
      participantes.push('');
    }
    db.query(
      'SELECT dni, nombre, apellidos, departamento, cargo FROM Usuario JOIN Votante USING(dni) WHERE dni NOT IN (?)' , [participantes], (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  } else {
    res.status(403).json({status: 'Restricted Access'});
  }
}