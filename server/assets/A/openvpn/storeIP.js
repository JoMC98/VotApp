const db = require('../../../controllers/db.js');

if (process.argv[2] && process.argv[3]) {
    var DNI = process.argv[2]
    var IP = process.argv[3]
    addIP(DNI, IP)
} else {
    console.log("***** Argumentos inválidos *****")
    return process.exit(1);
}

function addIP(DNI, IP) {
    db.query(
        'UPDATE Usuario SET VPN_IP=? WHERE DNI=?',
        [IP, DNI],
        (error) => {
        if (error) {
            console.log("***** Error al almacenar en la BBDD *****");
            return process.exit(1);
        } else {
            return process.exit(0);
        }
    })
}