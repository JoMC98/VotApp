async function checkExistentVotacion(db, codigo) {
    return await new Promise((resolve, reject) => {
        db.query(
            'SELECT codigo FROM Votacion WHERE codigo = ?', [codigo], (error, res) => {
                if (error) {
                    reject(false)
                } else {
                    if (res.length > 0) {
                        resolve(true)
                    } else {
                        reject(false)
                    }
                }
        })
    })
}

async function checkNewVotacion(db, votacion) {
    return await new Promise((resolve, reject) => {
        //TODO CHECK VALORES y AMBITO; DPTO en LISTA; FECHA > now
        resolve(true)
    })
}

async function checkModifyVotacion(db, votacion) {
    return await new Promise((resolve, reject) => {
        checkExistentVotacion(db, votacion.codigo).then(() => {
           //TODO CHECK VALORES y AMBITO; DPTO en LISTA; FECHA > now
        }).catch((err) => {
            var error = {code: 404, error: "Not Found"}
            reject(error);
        })
       
    })
}

module.exports = {
    checkExistentVotacion: checkExistentVotacion,
    checkNewVotacion: checkNewVotacion,
    checkModifyVotacion: checkModifyVotacion
}