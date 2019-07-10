var fs = require('fs');
var files = fs.readdirSync('./');
//console.log(files)

console.log(fs.lstatSync('./drive.js').isDirectory())