const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const spdy = require('spdy')
const http = require('http');
const fs = require('fs')

const routes = require('./controllers/routes.js');
const db = require('./controllers/db.js');
const middleware = require('./controllers/middleware.js');
const config = require("./.config/.config.js");

const httpsApp = express()
  .use('/', express.static('public'))

spdy.createServer({
  key: fs.readFileSync(config.SERVER_KEY),
  cert: fs.readFileSync(config.SERVER_CERTIFICATE)
}, httpsApp).listen(config.SERVER_HTTPS_PORT, config.SERVER_HOST, () => {
  console.log(`HTTPS Server listening on port ${config.SERVER_HTTPS_PORT}`);
});

const httpApp = express()
  .use('*', (req, res) => {
    res.redirect('https://' + req.headers.host + req.url);
  });

http.createServer(httpApp).listen(config.SERVER_HTTP_PORT, config.SERVER_HOST, () => {
  console.log(`HTTP Server listening on port ${config.SERVER_HTTP_PORT}`);
});

const apiApp = express()
  .use(cors())
  .use(middleware.verificaJSON)
  .use(bodyParser.json())
  .use(middleware.verificaToken)
  .use(routes(db));

spdy.createServer({
  key: fs.readFileSync(config.SERVER_KEY),
  cert: fs.readFileSync(config.SERVER_CERTIFICATE)
}, apiApp).listen(config.SERVER_API_PORT, config.SERVER_HOST, () => {
  console.log(`HTTPS Server listening on port ${config.SERVER_API_PORT}`);
});