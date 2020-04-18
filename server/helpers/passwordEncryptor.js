const bcrypt = require('bcrypt')

async function encryptPassword(passwd) {
    return await new Promise((resolve, reject) => {
        bcrypt.hash(passwd, 10, function(err, hash) {
            resolve(hash);
        });
    });
}

async function comparePassword(passwd, hash) {
    return await new Promise((resolve, reject) => {
        bcrypt.compare(passwd, hash).then(function(result) {
            resolve(result);
        });
    });
}

module.exports = {
    encryptPassword : encryptPassword,
    comparePassword : comparePassword
};