const config = require("../.config/.config.js");
const portsController = require('./auxiliarPuertos.js');
const https = require('https')
const fs = require('fs')
var WebSocketServer = require('websocket').server;

async function iniciarVotacion(listController) {
    return await new Promise((resolve, reject) => {
      var ports = crearSockets(listController)
      resolve(ports);
    });
}

function crearSockets(list) {
    socketReferences = {}
    error = {error: false}
    gestorSocketAdmin(list, socketReferences, error);

    var ports = {admin: list.adminPort, votantes: []}

    for (var ip of Object.keys(list.order)) {
        var listToSend = {list: list.list, order: list.order[ip].order, adminClavePublica: list.adminClavePublica}
        var userData = list.order[ip]
        userData["ip"] = ip
        ports.votantes.push([userData.dni, userData.port])
        socketReferences["ip"] = null

        gestorSocketVotante(listToSend, userData, socketReferences, error);


        // if(listToSend.order == "0") {
        //     gestorSocketVotanteInicial(listToSend, userData, socketReferences)
        // } else {
        //     gestorSocketVotante(listToSend, userData, socketReferences)
        // }
    }
    console.log(ports)
    return ports;
}

function gestorSocketAdmin(list, socketReferences, error) {
    var port = list.adminPort
    var ip = list.adminIP
    var listToSend = list.list

    var server = createServerSocket(port);
    var connected = false;
    var okStart = false;

    server.wsServer.on('request', function(request) {
        console.log("REQUEST")
        var requestIP = request.remoteAddress;

        // console.log(requestIP)
        //1st VALIDAR IP con VPN
        // if (!connected && requestIP == userData.ip) {

        if (!connected) {
            connected = true;
            console.log("CONNECTION")
            var connection = request.accept(null, request.origin);
            socketReferences["admin"] = connection;

            var firstMessage = false;

            connection.on('message', function(message) {
                if (message.type === 'utf8') {
                    //2nd COMPROBAR TOKEN JWT
                    var received = JSON.parse(message.utf8Data)
                    var mess = received.message

                    if (!firstMessage) {
                        if (error.error) {
                            console.log("FIRST ERROR")
                            connection.sendUTF(JSON.stringify({fase : "ERR", data : "ERROR CONEXION"}))
                        }
                        console.log("FIRST")
                        var list = {fase: 0, data: listToSend}
                        connection.sendUTF(JSON.stringify(list))
                        firstMessage = true;
                    } else if (mess && mess.fase && mess.fase == "END-OK") {
                        console.log("CIERRE OK adm")
                        server.httpServer.close()
                        connection.close()
                        portsController.liberatePort(port)
                    } else if (!okStart) {
                        console.log("OK START")
                        okStart = true;
                        if (received.data == "OK") {
                            for (var id of Object.keys(listToSend)) {
                                if (socketReferences[listToSend[id].ip]) {
                                    socketReferences[listToSend[id].ip].sendUTF(JSON.stringify({fase : "A3", data : "OK START"}))
                                }
                            }
                        } else {
                            console.log("ERROR START")
                        }
                    } else {
                        
                        var destino = received.destino
                        var message = received.message
                        var fase = message.fase

                        console.log(fase)
                        if (fase == "END") {
                            for (var id of Object.keys(listToSend)) {
                                socketReferences[listToSend[id].ip].sendUTF(JSON.stringify({fase : "END", data : ""}))
                            }
                            server.httpServer.close()
                            connection.close()
                            portsController.liberatePort(port)
                        } else {
                            if (socketReferences[destino]) {
                                socketReferences[destino].sendUTF(JSON.stringify(message));
                            }
                        }
                    }
                }
            });

            connection.on('close', function(connection) {
                error.error = true;
                for (var id of Object.keys(listToSend)) {
                    if (socketReferences[listToSend[id].ip]) {
                        socketReferences[listToSend[id].ip].sendUTF(JSON.stringify({fase : "ERR", data : "ERROR CONEXION"}))
                    }
                }
                if (socketReferences["admin"]) {
                    socketReferences["admin"].sendUTF(JSON.stringify({fase : "ERR", data : "ERROR CONEXION"}))
                }
            });

        } else {
            request.reject(401, "Restricted Access")
        }
    });
}


function gestorSocketVotante(listToSend, userData, socketReferences, error) {
    // console.log("Votante " + userData.ip + " en " + userData.port)
    var server = createServerSocket(userData.port);
    var connected = false;

    server.wsServer.on('request', function(request) {
        console.log("REQUEST")
        var requestIP = request.remoteAddress;

        // console.log(requestIP)
        //1st VALIDAR IP con VPN
        // if (!connected && requestIP == userData.ip) {
        if (connected && error.error) {
            var connection = request.accept(null, request.origin);
            connection.sendUTF(JSON.stringify({fase : "ERR", data : "ERROR CONEXION"}))
            connection.on('message', function(message) {
                var mess = JSON.parse(message.utf8Data)
                if (mess.message) {
                    var fase = mess.message.fase
                    if (fase == "END-OK") {
                        console.log("CIERRE OK con 2")
                        server.httpServer.close()
                        connection.close()
                        portsController.liberatePort(userData.port)
                    }
                }
            })
        } else if (!connected) {
            connected = true;
            var connection = request.accept(null, request.origin);
            socketReferences[userData.ip] = connection;

            var firstMessage = false;
            var okList = false;

            connection.on('message', function(message) {
                if (message.type === 'utf8') {

                    //2nd COMPROBAR TOKEN JWT
                    if (!firstMessage) {
                        console.log("FIRST VOTANTE")
                        var list = {fase: 0, data: listToSend}
                        connection.sendUTF(JSON.stringify(list))
                        firstMessage = true;
                        socketReferences["admin"].sendUTF(JSON.stringify({fase : "A1", data : userData.dni}))
                    } else if (!okList) {
                        console.log("OK LIST")
                        console.log(JSON.parse(message.utf8Data))
                        okList = true;
                        socketReferences["admin"].sendUTF(JSON.stringify({fase : "A2", data : userData.dni}))
                    } else {
                        var received = JSON.parse(message.utf8Data)
                        var destino = received.destino
                        var message = received.message
                        var fase = message.fase

                        console.log(fase)
                        if (fase == "END-OK") {
                            console.log("CIERRE OK vot")
                            server.httpServer.close()
                            connection.close()
                            portsController.liberatePort(userData.port)
                        } else {
                            if (socketReferences[destino]) {
                                socketReferences[destino].sendUTF(JSON.stringify(message));
                            }
                        }
                    }
                }
            });

            connection.on('close', function(connection) {
                error.error = true;
                for (var id of Object.keys(listToSend.list)) {
                    if (socketReferences[listToSend.list[id].ip]) {
                        socketReferences[listToSend.list[id].ip].sendUTF(JSON.stringify({fase : "ERR", data : "ERROR CONEXION"}))
                    }
                }
                if (socketReferences["admin"]) {
                    socketReferences["admin"].sendUTF(JSON.stringify({fase : "ERR", data : "ERROR CONEXION"}))
                }
            });

        } else {
            request.reject(401, "Restricted Access")
        }
    });
}


function gestorSocketVotanteInicial(listToSend, userData, socketReferences) {
    // console.log(listToSend)
    // console.log(userData)
    console.log("VOTANTE INICIAL CREA SERVER")
}

function createServerSocket(port) {
    var server = https.createServer({
        key: fs.readFileSync(config.SERVER_KEY),
        cert: fs.readFileSync(config.SERVER_CERTIFICATE)
    });

    server.listen(port, config.SERVER_HOST, function() {
        console.log("Server open at " + port)
    });

    wsServer = new WebSocketServer({
        httpServer: server
    });

    return {httpServer: server, wsServer: wsServer};
}

module.exports = {
    iniciarVotacion: iniciarVotacion
};