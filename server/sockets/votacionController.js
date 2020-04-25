const adminController = require('./adminController.js')
const votanteController = require('./votanteController.js')

async function iniciarVotacion(listController) {
    return await new Promise((resolve, reject) => {
      var ports = crearSockets(listController)
      resolve(ports);
    });
}

function crearSockets(list) {
    var socketReferences = {}
    var serverReferences = {}
    var conexion = {"admin": false}

    for (var ip of Object.keys(list.order)) {
        conexion[ip] = false;
        serverReferences[ip] = {server: null, port: list.order[ip].port}
        socketReferences[ip] = null
    }

    var state = {closed: false, error: false, conexion: conexion}

    var ports = {admin: list.adminPort, votantes: []}

    var references = {socketReferences: socketReferences, serverReferences: serverReferences}
    
    adminController.gestorSocketAdmin(list, references, state);

    for (var ip of Object.keys(list.order)) {
        var listToSend = {list: list.list, order: list.order[ip].order, adminClavePublica: list.adminClavePublica}
        var userData = list.order[ip]
        userData["ip"] = ip
        ports.votantes.push([userData.dni, userData.port])

        votanteController.gestorSocketVotante(listToSend, userData, references, state);
    }
    return ports;
}



module.exports = {
    iniciarVotacion: iniciarVotacion
};