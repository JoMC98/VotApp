const express = require('express');
const https = require('https')
const fs = require('fs')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()
  .use(cors())
  .use(bodyParser.json())

app.get('/', (req, res) => {
  res.status(200).json({status: "OKARDO"})
});

https.createServer({
  key: fs.readFileSync('./.config/server.key'),
  cert: fs.readFileSync('./.config/server.crt')
}, app).listen(4300, '192.168.210.6', () => {
  console.log(`Mysql server listening on port 4300`);
});

// app.listen(4300, '192.168.210.6', () => {
//   console.log(`Mysql server listening on port 4300`);
// });
