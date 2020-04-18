const mysql = require('mysql');
const config = require("../.config/.config.js");

const connection = mysql.createConnection({
    host     : config.DB_HOST,
    user     : config.DB_USER,
    password : config.DB_PASSWORD,
    database : config.DB_DATABASE
});

connection.connect();
module.exports = connection;