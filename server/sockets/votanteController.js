const portsController = require('./auxiliarPuertos.js');
const serverController = require('./serverController.js')

function gestorSocketVotante(listToSend, userData, socketReferences, state) {
    var server = serverController.createServerSocket(userData.port);
    var connected = false;
    var ip = userData.ip 

    server.wsServer.on('request', function(request) {
        var requestIP = request.remoteAddress;

        //1st VALIDAR IP con VPN

        // if (connected && state.error && requestIP == ip) {
        if (connected && state.error) {
            conexionTrasError(request, server)

        //} else if (!connected && requestIP == ip) {
        } else if (!connected) {
            connected = true;
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
        controlFases(message, socketReferences, dataLocal, userData, server)
    });

    connection.on('close', function(connection) {
        if (!state.closed) {
            state.error = true;
            avisarCierre(socketReferences, lista.list)
        }
    });
}

function controlFases(message, socketReferences, dataLocal, userData, server) {
    if (message.type === 'utf8') {
        //2nd COMPROBAR TOKEN JWT
        if (!dataLocal.firstMessage) {
            var list = {fase: 0, data: dataLocal.lista}
            dataLocal.connection.sendUTF(JSON.stringify(list))
            dataLocal.firstMessage = true;
            socketReferences["admin"].sendUTF(JSON.stringify({fase : "A1", data : userData.dni}))

        } else if (!dataLocal.okList) {
            dataLocal.okList = true;
            socketReferences["admin"].sendUTF(JSON.stringify({fase : "A2", data : userData.dni}))

        } else {
            controlVotos(message, socketReferences, dataLocal.connection, userData.port,  server)
        }
    }
}

function controlVotos(mess, socketReferences, connection, port, server) {
    var received = JSON.parse(mess.utf8Data)
    var destino = received.destino
    var message = received.message
    var fase = message.fase

    if (fase == "END-OK") {
        server.httpServer.close()
        connection.close()
        portsController.liberatePort(port)

    } else {
        if (socketReferences[destino]) {
            socketReferences[destino].sendUTF(JSON.stringify(message));
        }
    }
}

function avisarCierre(socketReferences, lista) {
    for (var id of Object.keys(lista)) {
        if (socketReferences[lista[id].ip]) {
            socketReferences[lista[id].ip].sendUTF(JSON.stringify({fase : "ERR", data : "ERROR CONEXION"}))
        }
    }
    if (socketReferences["admin"]) {
        socketReferences["admin"].sendUTF(JSON.stringify({fase : "ERR", data : "ERROR CONEXION"}))
    }
}

function conexionTrasError(request, server) {
    var connection = request.accept(null, request.origin);
    connection.sendUTF(JSON.stringify({fase : "ERR", data : "ERROR CONEXION"}))
    
    connection.on('message', function(message) {
        var mess = JSON.parse(message.utf8Data)

        if (mess.message) {
            if (mess.message.fase == "END-OK") {
                server.httpServer.close()
                connection.close()
                portsController.liberatePort(userData.port)
            }
        }
    })
}

module.exports = {
    gestorSocketVotante: gestorSocketVotante
};