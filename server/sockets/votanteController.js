const portsController = require('./auxiliarPuertos.js');
const serverController = require('./serverController.js')
const tokenController = require('../helpers/tokenJWT.js');
const resultadosController = require('../models/votacion/resultados.js')
const errorController = require('../models/acceso/errorVotacion.js')
const db = require('../controllers/db.js');

function gestorSocketVotante(listToSend, userData, references, state) {
    var socketReferences = references.socketReferences
    var serverReferences = references.serverReferences

    var server = serverController.createServerSocket(userData.port);
    var ip = userData.ip 

    serverReferences[ip].server = server

    server.wsServer.on('request', function(request) {
        var requestIP = request.remoteAddress;

        //TODO 1st VALIDAR IP con VPN y validar QUE VIENE DEL NISU

        //if (!state.conexion[ip] && requestIP == ip) {
        if (!state.conexion[ip]) {
            state.conexion[ip] = true;
            aceptarConexion(request, socketReferences, userData, server, state, listToSend)
        } else {
            request.reject(401, "Restricted Access")
        }
    });
}

function aceptarConexion(request, socketReferences, userData, server, state, lista) {
    var connection = request.accept(null, request.origin);    
    socketReferences[userData.ip] = connection;
    var dataLocal = {firstMessage: false, okList: false, connection: connection, lista: lista};

    connection.on('message', function(message) {
        controlFases(message, socketReferences, dataLocal, userData, server, state)
    });

    connection.on('close', function(connection) {
        if (!state.closed && state.conexion[userData.ip]) {
            state.error = true;
            sendMessageToAll(socketReferences, dataLocal, "ERR", "", state, userData.ip)

            errorController.cerrarVotacionError(db, state.codigo)
            errorController.addOptionalError(db, state.codigo, "ERR")

            setTimeout(() => {
                errorController.addOptionalError(db, state.codigo, null);
            }, 4000)

            closeServer(server, null, userData.port)
        }
    });
}

function controlFases(message, socketReferences, dataLocal, userData, server, state) {
    if (message.type === 'utf8') {
        if (!dataLocal.firstMessage) {
            var list = {fase: 0, data: dataLocal.lista}
            var received = JSON.parse(message.utf8Data)
            var token = received.token
            checkToken(token, userData, dataLocal, list, socketReferences)
        } else if (!dataLocal.okList) {
            dataLocal.okList = true;
            serverController.sendMessage(socketReferences["admin"], {fase : "A2", data : userData.dni})
        } else {
            controlVotos(message, socketReferences, dataLocal, userData, server, state)
        }
    }
}

function checkToken(token, userData, dataLocal, list, socketReferences) {
    tokenController.checkTokenSocket(token)
        .then(result => {
            if (result.DNI == userData.dni) {
                dataLocal.firstMessage = true;
                serverController.sendMessage(dataLocal.connection, list)
                serverController.sendMessage(socketReferences["admin"], {fase : "A1", data : userData.dni})
            } else {
                state.conexion[userData.ip] = false;
                dataLocal.connection.close();
            }
        }).catch(err => {
            state.conexion[userData.ip] = false;
            dataLocal.connection.close();
        })
}

function controlVotos(mess, socketReferences, dataLocal, userData, server, state) {
    var received = JSON.parse(mess.utf8Data)
    var destino = received.destino
    var message = received.message
    var fase = message.fase

    if (fase == "END-OK") {
        closeServer(server, dataLocal.connection, userData.port)
    }  else if (fase == "ALT") {
        sendMessageToAll(socketReferences, dataLocal, "ALT", "", state, null)
        errorController.cerrarVotacionError(db, state.codigo);

    } else if (fase == "1") {
        if (state.firsts != null) {
            state.firsts.messages.push(message.data)
            if (state.firsts.messages.length == state.firsts.total) {
                var mensaje = {fase: "1", data: state.firsts.messages}
                serverController.sendMessage(socketReferences[state.firsts.destino], mensaje)
                state.firsts = null
            }
        }
    } else if (fase == "Z") {
        if (!state.faseZ.users[userData.ip]) {
            state.faseZ.received = state.faseZ.received + 1;
            state.faseZ.users[userData.ip] = true;
            if (state.faseZ.total == state.faseZ.received) {
                sendMessageToAll(socketReferences, dataLocal, "END", "", state, null)
                resultadosController.addResultadosVotacion(db, state.codigo, state.faseZ.votos)
            }
        }
    }
    else {
        serverController.sendMessage(socketReferences[destino], message)
    }
}

function closeServer(server, connection, port) {
    console.log("CLOSING VOTANTE " + port)
    server.httpServer.close()
    if (connection != null) {
        connection.close()
    }
    portsController.liberatePort(port)
}

function sendMessageToAll(socketReferences, dataLocal, fase, data, state, exceptMe) {
    console.log("VOTER SENDING TO ALL " + fase)
    for (var id of Object.keys(dataLocal.lista.list)) {
        if (exceptMe == null || exceptMe != dataLocal.lista.list[id].ip) {
            serverController.sendMessage(socketReferences[dataLocal.lista.list[id].ip], {fase : fase, data : data})
        } else {
            console.log("VOTER EXCEPTION")
        }
    }
    serverController.sendMessage(socketReferences["admin"], {fase : fase, data : data})
    state.closed = true;
}

module.exports = {
    gestorSocketVotante: gestorSocketVotante
};