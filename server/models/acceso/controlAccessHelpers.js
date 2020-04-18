async function allowedUser(db, codigo, DNI, admin) {
    return await new Promise((resolve, reject) => {
      if (admin) {
        resolve(true)
      } else {
        obtenerDepartamentoUsuario(db, DNI).then((departamento) => {
            db.query(
                'SELECT codigo FROM Votacion WHERE codigo = ? AND (ambito = "Publica" ' +
                'OR (ambito = "Privada" AND ? IN (SELECT DNI FROM Participa WHERE codigo = ?)) ' +
                'OR (ambito = "Departamento" AND ? = (SELECT departamento FROM Votacion WHERE codigo = ?)) ' + 
                'OR (ambito = "Oculta" AND estado = "Activa" AND ? IN (SELECT DNI FROM Participa WHERE codigo = ?)))' 
                , [codigo, DNI, codigo, departamento, codigo, DNI, codigo], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                      if(results.length > 0) {
                        resolve(true)
                      } else {
                        reject("Restricted Access")
                      }
                    }
                }
            );
        });
      }
    })
  }

async function obtenerDepartamentoUsuario(db, DNI) {
    return await new Promise((resolve, reject) => {
      db.query(
        'SELECT departamento FROM Usuario WHERE DNI = ?' , [DNI], (error, results) => {
          if (error) {
            console.log(error);
          } else {
            resolve(results[0].departamento);
          }
        }
      ); 
    })
}

async function obtenerContrasenya(db, DNI) {
  return await new Promise((resolve, reject) => {
    db.query(
      'SELECT passwd FROM Usuario WHERE DNI = ?' , [DNI], (error, results) => {
        if (error) {
          console.log(error);
        } else {
          resolve(results);
        }
      }
    ); 
  })
}

module.exports = {
    allowedUser : allowedUser,
    obtenerDepartamentoUsuario : obtenerDepartamentoUsuario,
    obtenerContrasenya : obtenerContrasenya
};