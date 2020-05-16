const webpush = require('web-push')
const config = require("../.config/.config.js");
const fs = require('fs')

const fakeDatabase = {}

function readFile(file) {
    return fs.readFileSync(file)
}

function createPayload() {
    var notificationPayload = {
        "notification": {
            "identifier": config.PUSH_NOTIFICATION_ID,
            "title": "Votacion activa",
            "body": "Se ha activado una votacion en la que participas. Entra y vota",
        },
    };
    return notificationPayload;
  }

async function sendNotification(listDNI) {
    return await new Promise((resolve, reject) => {
        //TODO ACTIVAR PUSH (quitar if else)
        if (true) {
            console.log("SENDING PUSH TO " + listDNI)
            resolve(true)
        } else {
            let PUBLIC_KEY = readFile(config.VAPID_PUBLIC_KEY).toString('utf8')
            let PRIVATE_KEY = readFile(config.VAPID_PRIVATE_KEY).toString('utf8')

            webpush.setVapidDetails(config.VAPID_MAIL_TO, PUBLIC_KEY, PRIVATE_KEY)

            var payload = createPayload();

            subscriptions = []
            for(var dni of listDNI) {
                if (fakeDatabase[dni]) {
                    subscriptions.push(fakeDatabase[dni])
                }
            }

            Promise.all(subscriptions.map(
                sub => webpush.sendNotification(sub, JSON.stringify(payload))
            ))
            .then(() => resolve(true))
            .catch(() =>reject(true));   
        }
    })
}

async function addSubscription(req) {
    return await new Promise((resolve, reject) => {
        var dni = req.body.usuario.DNI;
        var subscription = req.body.subscription;

        fakeDatabase[dni] = subscription;
    })
}

module.exports = {
    addSubscription: addSubscription,
    sendNotification: sendNotification
  };