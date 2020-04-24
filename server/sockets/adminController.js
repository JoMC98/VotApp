const portsController = require('./auxiliarPuertos.js');
const serverController = require('./serverController.js')
const pushController = require('../helpers/pushController.js');

function gestorSocketAdmin(list, socketReferences, state) {
    var server = serverController.createServerSocket(list.adminPort);
    var connected = false;
    var ip = list.adminIP

    server.wsServer.on('request', function(request) {
        var requestIP = request.remoteAddress;

        //1st VALIDAR IP con VPN
        //if (!connected && requestIP == ip) {
        if (!connected) {
            connected = true;
            aceptarConexion(request, socketReferences, server, state, list)

        } else {
            request.reject(401, "Restricted Access")
        }
    });
}

function aceptarConexion(request, socketReferences, server, state, list) {
    var port = list.adminPort
    var lista = list.list

    var connection = request.accept(null, request.origin);
    socketReferences["admin"] = connection;
    var dataLocal = {firstMessage: false, okStart: false, connection: connection, lista: lista, port: port};

    connection.on('message', function(message) {
        controlFases(message, socketReferences, dataLocal, server, state)
    });

    connection.on('close', function(connection) {
        if (!state.closed) {
            state.error = true;
            avisarCierre(socketReferences, lista)
            closeServer(server, dataLocal.connection, dataLocal.port)
        }
    });
}

function controlFases(message, socketReferences, dataLocal, server, state) {
    if (message.type === 'utf8') {
        //2nd COMPROBAR TOKEN JWT
        var received = JSON.parse(message.utf8Data)
        var mess = received.message

        if (!dataLocal.firstMessage) {
            if (state.error) {
                serverController.sendMessage(dataLocal.connection, {fase : "ERR", data : "ERROR CONEXION"})
            } else {
                var list = {fase: 0, data: dataLocal.lista}
                serverController.sendMessage(dataLocal.connection, list)
                dataLocal.firstMessage = true;
            }
        } else if (mess && mess.fase && mess.fase == "END-OK") {
            closeServer(server, dataLocal.connection, dataLocal.port)

        }  else if (mess && mess.fase && mess.fase == "PUSH") {
            var dnis = [mess.data.dni]
            pushController.sendNotification(dnis)

        } else if (!dataLocal.okStart) {
            dataLocal.okStart = true;

            if (received.data == "OK") {
                for (var id of Object.keys(dataLocal.lista)) {
                    serverController.sendMessage(socketReferences[dataLocal.lista[id].ip], {fase : "A3", data : "OK START"})
                }
            }
        } else {
            controlVotos(received, socketReferences, dataLocal, server, state)
        }
    }
}

function controlVotos(received, socketReferences, dataLocal, server, state) {
    var destino = received.destino
    var message = received.message
    var fase = message.fase

    if (fase == "END") {
        for (var id of Object.keys(dataLocal.lista)) {
            serverController.sendMessage(socketReferences[dataLocal.lista[id].ip], {fase : "END", data : ""})
        }
        state.closed = true;
        closeServer(server, dataLocal.connection, dataLocal.port)
    } else {
        serverController.sendMessage(socketReferences[destino], message)
    }
}

function closeServer(server, connection, port) {
    console.log("CLOSING")
    server.httpServer.close()
    connection.close()
    portsController.liberatePort(port)
}

function avisarCierre(socketReferences, lista) {
    for (var id of Object.keys(lista)) {
        serverController.sendMessage(socketReferences[lista[id].ip], {fase : "ERR", data : "ERROR CONEXION"})
    }
    serverController.sendMessage(socketReferences["admin"], {fase : "ERR", data : "ERROR CONEXION"})
}


module.exports = {
    gestorSocketAdmin: gestorSocketAdmin
};