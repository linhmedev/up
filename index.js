const fs = require('fs');

const UploadFolder = require('./uploadFolder')


var folderDownload = fs.readdirSync('./download');
UploadFolder.UploadFolder(folderDownload);




