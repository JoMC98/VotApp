var fs = require('fs');
var handlebars = require('handlebars');

async function readHTMLFile(path) {
    return await new Promise((resolve, reject) => {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                reject(err)
            }
            else {
                resolve(handlebars.compile(html))
            }
        });
  });
}

module.exports = {
    readHTMLFile: readHTMLFile
};