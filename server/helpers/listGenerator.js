exports.generateListOptions = (codigo, opciones) => {
    var options = []
    for (var opt of opciones) {
        var a = [codigo, opt]
        options.push(a)
    }
    return options
}

exports.generateListParticipants = (codigo, participantes) => {
    var participants = []
    for (var dni of participantes) {
        var a = [dni, codigo]
        participants.push(a)
    }
    return participants
}

exports.generateListResultados = async (db, codigo, vots) => {
    return await new Promise((resolve, reject) => {
        obtenerOpcionesVotacion(db, codigo).then(options => {
            var votos = []
            for (var opt of options) {
                var total_votos = vots.filter(x => x == opt.opcion).length
                votos.push([codigo, opt.opcion, total_votos])
            }
            resolve(votos)
        })
    })
}

async function obtenerOpcionesVotacion(db, codigo) {
    return await new Promise((resolve, reject) => {
        db.query(
            'SELECT opcion FROM Opcion WHERE codigo=?', [codigo], (error, results) => {
                if (error) {
                    reject(false)
                } else {
                    resolve(results)
                }
        }); 
    });
}