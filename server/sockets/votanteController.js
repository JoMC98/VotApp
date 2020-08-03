const portsController = require('./auxiliarPuertos.js');
const serverController = require('./serverController.js')
const tokenController = require('../helpers/tokenJWT.js');
const resultadosController = require('../models/votacion/resultados.js')
const errorController = require('../models/acceso/errorVotacion.js')
const db = require('../controllers/db.js');

var alteracion = { cifrado: 'fofnAKWbCzAqEKWYs27PhkaEZCwlzyu9GxGf4j/vdW56sJZEEnOiNRnYXBVLc+0OObB4t5b0rxrpXza5qJGbMc6Nq8xARQNegmFkzJsz1icyPwLfEGmJs6Y11lR1piCxp27FJReIv3BtMn+jheRbNLaWt+gkJ8iE/fEm1GpC40uf4rCg0//H9n4CYQkeDiRd3tmOjvJKJJBzV+Om+oG5e702CrqoZA2OUCbw6+V6vKjVt7Dq25CFyMwW2IKZo0dSO5VVBW67KPyOAEecZ9rXbJhqvLWxSeyoLqpa79+/sRFU1gLOYjjp0+OOpYDJdMTxNOr1RBvErLA9BebOYPrXqA==pxpYsB9hBksmNGDscNBcXmRkVVmAAx1tDYBfTAs6zYrKxN1HP+Ikg1VVJaQGCgsBR7f+CiE2gfoilDnE/0eDePwutqhEmPcbRrm1IPEZCB3fG9eEbldWIAdv2PmSCfBrpElB9pyiOTSjPhk7X18g30FbKwb3kvuMwZ4+64XWasySlaSJbvIHqVSHaJ5Z+jxw9zCKghw6CaxwtZ7mwTTbDVCmBHjsU4JSxXVpoFgYyR+q5vm/pAcXhzIv5MNq4HFfR61YMqrLUqppFfAP8mpzZhJmxS/zPzCS1OXHR90l61ExWq1qmUHpB3uol+ShC7n6mvKzh8OLRu6bw7vI19e+hA==aMXWIy757/6Y5wK3nDdBfzKtR0OC3rE078XQoZWADiE37Ivbq7Qp0llRJTOU/4NwOU2KDLDM9hPX4B5BWyisLgVGc31FeCSI+iI+PZkVjeb9OVb4hslUWHunx+YJj3Ip9nxBPhorGUbaGfvxByRam9MlxdYybjMHdgj3S2q71uo3DdgwpMbLEnwP6tHsLturme+JVqNlGmhyu2jNZwhFg5bhh+sCuLre8O/yfiJUIi41lxDAPtc/ADWJ2HwmQtGAECELsOh6+zQ5EJx44JTqiM2s00mvzxCsAI0bdepKhJBWvcdBxLDG6ZGk//L0+5RoDhWH5VzNeN28P/EXtw5Ncw==',
       signature: 'dGrksvGYnmowvbWxnLxAM7A0zrqr9bEmnne462Yc7YjPgo4aJs/0VPv4qGfjsnMtH7EM2nzbxfasMOOVrxNRsPbmrutklofLyu2dDLOixk6oD7pNO3jSUNMGVjMqE1oh2hvm9fTas5rMysyHhSvM0RNKiJIJYhdEayxd8aVDYISkUe28L8ROBvMWPzrY6R0r3XAsfmEcIGhG0SU0RCTyP84tv9QYs2N+LfZmN7IXOelDvNw0Bocd2dKtH4eTjYjv1WYdivgoQldX8ZQGTw0wJQNNzN54z8v+/bNLh44tlZkCBPPvOmt4KvZKqtnASKHHlUQFAiIlI0vOXPaHhWTAUg==' }

function gestorSocketVotante(listToSend, userData, references, state) {
    var socketReferences = references.socketReferences
    var serverReferences = references.serverReferences

    var server = serverController.createServerSocket(userData.port);

    var ip = userData.ip 

    serverReferences[ip].server = server

    server.wsServer.on('request', function(request) {
        //TODO VALIDAR IP
        // var requestIP = request.remoteAddress;
        // if (!state.conexion[ip] && requestIP == ip) {
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
    } else if (fase == "4") {
        //message.data.list[0] = alteracion
        serverController.sendMessage(socketReferences[destino], message)
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