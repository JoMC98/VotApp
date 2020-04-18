var WebSocketServer = require('websocket').server;
const config = require("./.config/.config.js");
const https = require('https')
const fs = require('fs')

var port = 4300;
var host = "150.128.97.91";
//var host = "localhost";

// var server = http.createServer(function(request, response) {
// });

var server = https.createServer({
  key: fs.readFileSync(config.SERVER_KEY),
  cert: fs.readFileSync(config.SERVER_CERTIFICATE)
});

server.listen(port, host, function() {
    console.log("server open at " + port)
 });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  console.log("conexion")
  //console.log(request.httpRequest.headers)
  //CONTROL POR IP
  console.log(request.remoteAddress)

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        connection.sendUTF(message.utf8Data);
    }
  });

  connection.on('close', function(connection) {
    console.log("client closed connection");
    // close user connection
     server.close();
  });
});