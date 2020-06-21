const mail = require("./helpers/mailSender");

data = {destination: "jordimc98@gmail.com", password: "abcdefg123", name: "Pedro", newUser: true}

data2 = {destination: "jordimc98@gmail.com", password: "jklmnopq987", name: "José", newUser: false}

// mail.sendNewMail(data)
mail.sendNewMail(data2)