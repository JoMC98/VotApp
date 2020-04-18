const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https')
const fs = require('fs')


const routes = require('./controllers/routes.js');
const db = require('./controllers/db.js');
const middleware = require('./controllers/authentication.js');
const config = require("./.config/.config.js");

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(middleware.verificaToken)
  .use(routes(db));

// https.createServer({
  // key: fs.readFileSync(config.SERVER_KEY),
  // cert: fs.readFileSync(config.SERVER_CERTIFICATE)
// }, app).listen(config.SERVER_PORT, config.SERVER_HOST, () => {
//   console.log(`Mysql server listening on port ${config.SERVER_PORT}`);
// });

app.listen(config.SERVER_PORT, config.SERVER_HOST, () => {
  console.log(`Mysql server listening on port ${config.SERVER_PORT}`);
});
