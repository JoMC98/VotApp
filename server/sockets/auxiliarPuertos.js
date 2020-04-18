const secureRandom = require('secure-random')
const config = require("../.config/.config.js");
var freePorts = config.INITIAL_FREE_PORTS;
var usedPorts = []

exports.generarListasVotacion = (participantes, ports, admin_IP, admin_clavePublica) => {
    participantes = generarOrdenVotacion(participantes);

    listVotantes = {list: {}, order: {}, adminPort: ports.pop(), adminIP: admin_IP, adminClavePublica: admin_clavePublica}

    for (var i in participantes) {
        listVotantes.list[i] = {ip: participantes[i].VPN_IP, clavePublica: participantes[i].clavePublica}
        listVotantes.order[participantes[i].VPN_IP] = {order: i, dni: participantes[i].dni, port: ports[i]};
    }

    return listVotantes;
}

exports.getFreePorts = (total) => {
    if (freePorts < total) {
        return "Wait";
    } else {
        var ports = []
        for(var v=0; v<total; v++) {
            ports.push(getPort());
        }
        return ports;
    }
}

exports.liberatePort = (port) => {
    usedPorts.splice(usedPorts.indexOf(port), 1);
    freePorts++;
}


function generarOrdenVotacion(participantes) {
    var list = []
    for (var i=0; i<participantes.length; i++) {
      var p = participantes[getRandomSecureNumber(participantes.length)]
      while (list.includes(p)) {
        p = participantes[getRandomSecureNumber(participantes.length)]
      }
      list.push(p)
    }
    return list;
}

function getRandomSecureNumber(mod) {
    return secureRandom(1)[0] % mod;
}

function getPort() {
    var p = getRandomNumber();
    while (usedPorts.includes(p)) {
        p = getRandomNumber();
    }
    usedPorts.push(p);
    freePorts--;
    return p;
}

function getRandomNumber() {
    return Math.floor(Math.random() * ((config.MAX_PORT_SOCKET + 1) - config.MIN_PORT_SOCKET) + config.MIN_PORT_SOCKET);
}