var JWT = require('jsonwebtoken')
const config = require("../.config/.config.js");
const fs = require('fs')

function readFile(file) {
    return fs.readFileSync(file)
}

async function createToken(DNI, admin, socket) {
    var maxTime;

    if (!socket) {
        maxTime = admin ? config.JWT_MAX_TIME_ADMIN : config.JWT_MAX_TIME_VOTANTE;
    } else {
        maxTime = config.JWT_MAX_TIME_SOCKETS;
    }
    
    return await new Promise((resolve, reject) => {
        let payload = {
            sub: DNI,
            admin: admin
        };
        let options = {
            expiresIn: maxTime,
            algorithm: config.JWT_ALGHORITHM
        }
        let PRIVATE_KEY = readFile(config.JWT_PRIVATE_KEY)
        resolve(JWT.sign(payload, PRIVATE_KEY, options))
    });
}

async function checkToken(req) {
    return await new Promise((resolve, reject) => {
        if (!req.headers.authorization || req.headers.authorization.split(" ")[1] == "null") {
            reject('Token Not Found')
        } else {
            var token = req.headers.authorization.split(" ")[1];
            try {
                let options = {
                    algorithm: config.JWT_ALGHORITHM
                }
                let PUBLIC_KEY = readFile(config.JWT_PUBLIC_KEY)
                var payload = JWT.verify(token, PUBLIC_KEY, options);
                var response = {DNI: payload.sub, admin: payload.admin};
                resolve(response) 
            } catch(error) {
                reject('Token Not Valid')
            }
        }
    });
}

async function checkTokenSocket(token) {
    return await new Promise((resolve, reject) => {
        if (!token || token == "") {
            reject('Token Not Found')
        } else {
            try {
                let options = {
                    algorithm: config.JWT_ALGHORITHM
                }
                let PUBLIC_KEY = readFile(config.JWT_PUBLIC_KEY)
                var payload = JWT.verify(token, PUBLIC_KEY, options);
                var response = {DNI: payload.sub, admin: payload.admin};
                resolve(response) 
            } catch(error) {
                reject('Token Not Valid')
            }
        }
    });
}

module.exports = {
    createToken : createToken,
    checkToken : checkToken,
    checkTokenSocket: checkTokenSocket
};