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

        //1st VALIDAR IP con VPN y validar QUE VIENE DEL NISU

        // if (state.conexion[ip] && state.error && requestIP == ip) {
        if (state.conexion[ip] && state.error) {
            conexionTrasError(request, server, userData)

        //} else if (!state.conexion[ip] && requestIP == ip) {
        } else if (!state.conexion[ip]) {
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
            avisarCierre(socketReferences, lista.list)
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
                console.log("VOTANTE OK")
                dataLocal.firstMessage = true;
                serverController.sendMessage(dataLocal.connection, list)
                serverController.sendMessage(socketReferences["admin"], {fase : "A1", data : userData.dni})
            } else {
                console.log("VOTANTE NO OK")
                state.conexion[userData.ip] = false;
                dataLocal.connection.close();
            }
        }).catch(err => {
            console.log(err)
            console.log("VOTANTE NO TOKEN")
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
        for (var id of Object.keys(dataLocal.lista.list)) {
            serverController.sendMessage(socketReferences[dataLocal.lista.list[id].ip], {fase : "ALT", data : ""})
        }
        serverController.sendMessage(socketReferences["admin"], {fase : "ALT", data : ""});
        errorController.cerrarVotacionError(db, state.codigo);
        state.closed = true;
        //CERRAR LA VOTACION
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
                resultadosController.addResultadosVotacion(db, state.faseZ.votos)
                for (var id of Object.keys(dataLocal.lista.list)) {
                    serverController.sendMessage(socketReferences[dataLocal.lista.list[id].ip], {fase : "END", data : ""})
                }
                serverController.sendMessage(socketReferences["admin"], {fase : "END", data : ""})
                state.closed = true;
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

function avisarCierre(socketReferences, lista) {
    console.log("AVISANDO CIERRE VOTANTE")
    for (var id of Object.keys(lista)) {
        serverController.sendMessage(socketReferences[lista[id].ip], {fase : "ERR", data : "ERROR CONEXION"})
    }
    serverController.sendMessage(socketReferences["admin"], {fase : "ERR", data : "ERROR CONEXION"})
}

function conexionTrasError(request, server, userData) {
    console.log("CONEXION TRAS ERROR")
    var connection = request.accept(null, request.origin);
    serverController.sendMessage(connection, {fase : "ERR", data : "ERROR CONEXION"})
    
    connection.on('message', function(message) {
        var mess = JSON.parse(message.utf8Data)
        if (mess.message) {
            if (mess.message.fase == "END-OK") {
                closeServer(server, connection, userData.port)
            }
        }
    })
}

module.exports = {
    gestorSocketVotante: gestorSocketVotante
};