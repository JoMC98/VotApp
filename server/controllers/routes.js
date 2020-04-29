const usuario = require('../routes/usuario/usuario.js');
const password = require('../routes/usuario/password.js');
const usuarios = require('../routes/usuario/usuarios.js');

const votacion = require('../routes/votacion/votacion.js');
const votaciones = require('../routes/votacion/votaciones.js');
const resultados = require('../routes/votacion/resultados.js');
const opciones = require('../routes/votacion/opciones.js');
const participantes = require('../routes/votacion/participantes.js');

const login = require('../routes/acceso/login.js');
const sockets = require('../routes/acceso/sockets.js');
const pushController = require('../routes/acceso/push.js');
const notFoundController = require('../routes/acceso/notFound.js');

function findModels(db) {
  var routers = []
  routers.push(usuario(db));
  routers.push(password(db));
  routers.push(usuarios(db));

  routers.push(votacion(db));
  routers.push(votaciones(db));
  routers.push(resultados(db));
  routers.push(opciones(db));
  routers.push(participantes(db));

  routers.push(login(db));
  routers.push(sockets(db));
  routers.push(pushController());
  routers.push(notFoundController());
  
  return routers;
}

module.exports = findModels;