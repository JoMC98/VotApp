const auxiliar = require("./auxiliarPuertos.js");
const config = require("../.config/.config.js");
const spdy = require('spdy')
const fs = require('fs')
var WebSocketServer = require('websocket').server;

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

function createServerSocket(port) {
    var server = spdy.createServer({
        key: fs.readFileSync(config.SERVER_KEY),
        cert: fs.readFileSync(config.SERVER_CERTIFICATE)
      })

    server.listen(port, config.SERVER_HOST, function() {
        console.log("Server open at " + port)
    });

    wsServer = new WebSocketServer({
        httpServer: server
    });

    return {httpServer: server, wsServer: wsServer};
}

function sendMessage(socket, message) {
    if (socket && socket.sendUTF && message) {
        socket.sendUTF(JSON.stringify(message));
    }
}
  
module.exports = {
    obtenerListaPuertos: obtenerListaPuertos,
    createServerSocket: createServerSocket,
    sendMessage: sendMessage
};