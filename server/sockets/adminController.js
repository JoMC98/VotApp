const portsController = require('./auxiliarPuertos.js');
const serverController = require('./serverController.js')
const pushController = require('../helpers/pushController.js');
const tokenController = require('../helpers/tokenJWT.js');
const errorController = require('../models/acceso/errorVotacion.js')
const db = require('../controllers/db.js');

function gestorSocketAdmin(list, references, state) {
    var socketReferences = references.socketReferences
    var serverReferences = references.serverReferences

    var server = serverController.createServerSocket(list.adminPort);
    var ip = list.adminIP

    server.wsServer.on('request', function(request) {
        var requestIP = request.remoteAddress;

        //TODO 1st VALIDAR IP con VPN y validar QUE VIENE DEL NISU
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
            sendMessageToAll(socketReferences, dataLocal, "ERR", "", state, "admin")
            closeServer(server, null, dataLocal.port, state, serverReferences)

            errorController.cerrarVotacionError(db, state.codigo)
            errorController.addOptionalError(db, state.codigo, "ERR")

            setTimeout(() => {
                errorController.addOptionalError(db, state.codigo, null);
            }, 4000)
        }
    });
}

function controlFases(message, socketReferences, serverReferences, dataLocal, server, state) {
    if (message.type === 'utf8') {
        var received = JSON.parse(message.utf8Data)
        var mess = received.message

        if (!dataLocal.firstMessage) {
            var token = received.token
            checkToken(token, dataLocal)
        } else if (mess && mess.fase && mess.fase == "END-OK") {
            closeServer(server, dataLocal.connection, dataLocal.port, state, serverReferences)

        }  else if (mess && mess.fase && mess.fase == "PUSH") {
            var dnis = [mess.data.dni]
            pushController.sendNotification(dnis)

        } else if (mess && mess.fase && mess.fase == "STOP") {
            sendMessageToAll(socketReferences, dataLocal, "STOP", "", state, null)

            errorController.cerrarVotacionError(db, state.codigo)
            errorController.addOptionalError(db, state.codigo, "STOP")

            setTimeout(() => {
                errorController.addOptionalError(db, state.codigo, null);
            }, 4000)

        } 
        else if (!dataLocal.okStart) {
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

    if (fase == "Y") {
        if (destino == "server") {
            state.faseZ.votos = message.data;
        } else {
            console.log("SEND Y")
            serverController.sendMessage(socketReferences[destino], message)
        }
    } else if (fase == "ALT") {
        sendMessageToAll(socketReferences, dataLocal, "ALT", "", state, null)
        errorController.cerrarVotacionError(db, state.codigo);
    } else {
        serverController.sendMessage(socketReferences[destino], message)
    }
}

function closeServer(server, connection, port, state, serverReferences) {
    console.log("CLOSING ADMIN")
    server.httpServer.close()
    if (connection != null) {
        connection.close()
    }
    portsController.liberatePort(port)
    
    for (var ip of Object.keys(serverReferences)) {
        if (!state.conexion[ip]) {
            console.log("CLOSING ADMIN " + ip)
            serverReferences[ip].server.httpServer.close()
            portsController.liberatePort(serverReferences[ip].port)
        }
    }
}

function sendMessageToAll(socketReferences, dataLocal, fase, data, state, exceptMe) {
    console.log("ADMIN SENDING TO ALL " + fase)
    for (var id of Object.keys(dataLocal.lista)) {
        serverController.sendMessage(socketReferences[dataLocal.lista[id].ip], {fase : fase, data : data})
    }
    if (exceptMe == null) {
        serverController.sendMessage(socketReferences["admin"], {fase : fase, data : data})
    } else {
        console.log("ADMIN EXCEPTION")
    }
    state.closed = true;
}

module.exports = {
    gestorSocketAdmin: gestorSocketAdmin
};