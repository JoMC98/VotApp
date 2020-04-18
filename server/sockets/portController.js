const auxiliar = require("./auxiliarPuertos.js");

async function obtenerListaPuertos(result) {
    return await new Promise((resolve, reject) => {
        var participantes = result.participantes
        var admin_IP = result.admin.VPN_IP
        var admin_clavePublica = result.admin.clavePublica
        var ports = auxiliar.getFreePorts(participantes.length + 1);
        if (ports == "Wait") {
            reject("Wait")
        } else {
            list = auxiliar.generarListasVotacion(participantes, ports, admin_IP, admin_clavePublica);
            resolve(list)
        }
    });
}
  
module.exports = {
    obtenerListaPuertos: obtenerListaPuertos
};