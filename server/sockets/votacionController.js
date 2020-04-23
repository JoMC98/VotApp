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
    var state = {closed: false, error: false}
    var ports = {admin: list.adminPort, votantes: []}
    
    adminController.gestorSocketAdmin(list, socketReferences, state);

    for (var ip of Object.keys(list.order)) {
        var listToSend = {list: list.list, order: list.order[ip].order, adminClavePublica: list.adminClavePublica}
        var userData = list.order[ip]
        userData["ip"] = ip
        ports.votantes.push([userData.dni, userData.port])
        socketReferences["ip"] = null

        votanteController.gestorSocketVotante(listToSend, userData, socketReferences, state);
    }
    return ports;
}

module.exports = {
    iniciarVotacion: iniciarVotacion,
};