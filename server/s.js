const enc = require('./helpers/passwordEncryptor.js')
const val = require('./validators/login.js')
const db = require('./controllers/db.js')

enc.encryptPassword("patata").then(hash => {
    console.log(hash)
    enc.comparePassword("patata", hash).then(equals => {
        console.log(equals)
        val.checkDNÍ(db, '11112222A').then(user => {
            var passwd = user.passwd
            console.log(passwd)
            enc.comparePassword("patata", passwd).then(equals => {
                console.log(equals)
            })
        })
    })
})

