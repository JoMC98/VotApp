const adminController = require('./adminController.js')
const votanteController = require('./votanteController.js')

async function iniciarVotacion(listController, codigo) {
    return await new Promise((resolve, reject) => {
      var ports = crearSockets(listController, codigo)
      resolve(ports);
    });
}

function crearSockets(list, codigo) {
    var socketReferences = {}
    var serverReferences = {}
    var conexion = {"admin": false}
    var users = {}

    for (var ip of Object.keys(list.order)) {
        conexion[ip] = false;
        serverReferences[ip] = {server: null, port: list.order[ip].port}
        socketReferences[ip] = null
        users[ip] = false
    }

    var votante1 = list.list["0"].ip
    var total = Object.keys(list.order).length
    var state = {codigo: codigo, closed: false, error: false, conexion: conexion, firsts: {destino: votante1, total: total, messages: []}, faseZ: {votos: [], total: total, received: 0, users: users}}

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