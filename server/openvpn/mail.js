const db = require('../controllers/db.js');
const mailController = require('../helpers/mailSender.js')

if (process.argv[2]) {
    var DNI = process.argv[2]
    getMail(DNI)
} else {
    console.log("***** Argumentos inválidos *****")
    return process.exit(1);
}

function getMail(DNI) {
    db.query(
        'SELECT mail FROM Usuario WHERE DNI=?', [DNI], 
        (error, result) => {
            if (error) {
                console.log("***** Error al obtener mail *****");
                return process.exit(1);
            } else {
                var mail = result[0].mail
                mailController.sendConfigurationFiles(mail, DNI)
                    .then(r => {
                        return process.exit(0);
                    }).catch(err => {
                        console.log("***** ERROR AL ENVIAR CORREO *****");
                        return process.exit(1);
                    })
            }
    });
}
