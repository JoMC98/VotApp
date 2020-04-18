var nodemailer = require('nodemailer');
const config = require("../.config/.config.js");
var reader = require('./readHTML.js');

function createTransporter() {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    //secure: true,
    secure: false,
    auth: {
      user: config.MAIL_USERNAME,
      pass: config.MAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  return transporter;
}

async function createOptions(destination, password, name, newUser) {
  return await new Promise((resolve, reject) => {
    var path = newUser ? config.TEMPLATE_NEW_USER : config.TEMPLATE_CHANGE_PASSWD;
    var subject = newUser ? "Has sido dado de alta en VotApp por el administrador" : "Su contraseña en VotApp ha sido modificada";

    var replacements = {
      nombre: name,
      password: password
    };

    reader.readHTMLFile(path)
      .then(template => {
        mailOptions = {
          to: destination,
          subject: subject,
          html: template(replacements),
          attachments: config.MAIL_ATACHMENTS
        };
        resolve(mailOptions)
      })
      .catch(err => {
        reject(err)
      })
  });
}

async function sendNewMail(data) {
  return await new Promise((resolve, reject) => {
    var transporter = createTransporter();
    createOptions(data.destination, data.password, data.name, data.newUser)
      .then(mailOptions => {
        resolve("OK")
        // transporter.sendMail(mailOptions, function(error, info){
        //   if (error) {
        //     reject(error)
        //   } else {
        //     resolve("OK")
        //     transport.close();
        //   }
        // });
      })
      .catch(err => {
        reject(err)
      })
  });
}

module.exports = {
  sendNewMail: sendNewMail
};