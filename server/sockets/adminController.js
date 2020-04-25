const portsController = require('./auxiliarPuertos.js');
const serverController = require('./serverController.js')
const pushController = require('../helpers/pushController.js');
const tokenController = require('../helpers/tokenJWT.js');

function gestorSocketAdmin(list, references, state) {
    var socketReferences = references.socketReferences
    var serverReferences = references.serverReferences

    var server = serverController.createServerSocket(list.adminPort);

    var ip = list.adminIP

    server.wsServer.on('request', function(request) {
        var requestIP = request.remoteAddress;

        //1st VALIDAR IP con VPN y validar QUE VIENE DEL NISU
        //if (!connected && requestIP == ip) {
        if (!state.conexion.admin) {
            state.conexion.admin = true;
            aceptarConexion(request, socketReferences, serverReferences, server, state, list)

        } else {
            request.reject(401, "Restricted Access")
        }
    });
}

function aceptarConexion(request, socketReferences, serverReferences, server, state, list) {
    var port = list.adminPort
    var lista = list.list

    var connection = request.accept(null, request.origin);
    socketReferences["admin"] = connection;
    var dataLocal = {firstMessage: false, okStart: false, connection: connection, lista: lista, port: port};

    connection.on('message', function(message) {
        controlFases(message, socketReferences, serverReferences, dataLocal, server, state)
    });

    connection.on('close', function(connection) {
        if (!state.closed && state.conexion.admin) {
            state.error = true;
            avisarCierre(socketReferences, lista)
            closeServer(server, dataLocal.connection, dataLocal.port, state, serverReferences)
        }
    });
}

function controlFases(message, socketReferences, serverReferences, dataLocal, server, state) {
    if (message.type === 'utf8') {
        var received = JSON.parse(message.utf8Data)
        var mess = received.message

        if (!dataLocal.firstMessage) {
            if (state.error) {
                serverController.sendMessage(dataLocal.connection, {fase : "ERR", data : "ERROR CONEXION"})
            } else {
                var token = received.token
                checkToken(token, dataLocal)
            }
        } else if (mess && mess.fase && mess.fase == "END-OK") {
            closeServer(server, dataLocal.connection, dataLocal.port, state, serverReferences)

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
            controlVotos(received, socketReferences, serverReferences, dataLocal, server, state)
        }
    }
}

function checkToken(token, dataLocal) {
    tokenController.checkTokenSocket(token)
    .then(result => {
        if (result.admin) {
            var list = {fase: 0, data: dataLocal.lista}
            serverController.sendMessage(dataLocal.connection, list)
            dataLocal.firstMessage = true;
        } else {
            state.conexion.admin = false;
            dataLocal.connection.close();
        }
    }).catch(err => {
        state.conexion.admin = false;
        dataLocal.connection.close();
    })
}

function controlVotos(received, socketReferences, serverReferences, dataLocal, server, state) {
    var destino = received.destino
    var message = received.message
    var fase = message.fase

    if (fase == "END") {
        for (var id of Object.keys(dataLocal.lista)) {
            serverController.sendMessage(socketReferences[dataLocal.lista[id].ip], {fase : "END", data : ""})
        }
        state.closed = true;
        closeServer(server, dataLocal.connection, dataLocal.port, state, serverReferences)
    } else {
        serverController.sendMessage(socketReferences[destino], message)
    }
}

function closeServer(server, connection, port, state, serverReferences) {
    console.log("CLOSING ADMIN")
    server.httpServer.close()
    connection.close()
    portsController.liberatePort(port)
    
    for (var ip of Object.keys(serverReferences)) {
        if (!state.conexion[ip]) {
            serverReferences[ip].server.httpServer.close()
            portsController.liberatePort(serverReferences[ip].port)
        }
    }
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