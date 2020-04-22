const portsController = require('./auxiliarPuertos.js');
const serverController = require('./serverController.js')

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
                dataLocal.connection.sendUTF(JSON.stringify({fase : "ERR", data : "ERROR CONEXION"}))
            }
            var list = {fase: 0, data: dataLocal.lista}
            dataLocal.connection.sendUTF(JSON.stringify(list))
            dataLocal.firstMessage = true;

        } else if (mess && mess.fase && mess.fase == "END-OK") {
            server.httpServer.close()
            dataLocal.connection.close()
            portsController.liberatePort(dataLocal.port)

        } else if (!dataLocal.okStart) {
            dataLocal.okStart = true;

            if (received.data == "OK") {
                for (var id of Object.keys(dataLocal.lista)) {
                    if (socketReferences[dataLocal.lista[id].ip]) {
                        socketReferences[dataLocal.lista[id].ip].sendUTF(JSON.stringify({fase : "A3", data : "OK START"}))
                    }
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
            socketReferences[dataLocal.lista[id].ip].sendUTF(JSON.stringify({fase : "END", data : ""}))
        }
        state.closed = true;
        server.httpServer.close()
        dataLocal.connection.close()
        portsController.liberatePort(dataLocal.port)
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


module.exports = {
    gestorSocketAdmin: gestorSocketAdmin
};