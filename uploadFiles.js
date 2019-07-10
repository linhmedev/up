/*global file */
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

module.exports.UploadFiles = async (directory, folderid) => {
    let rootDirectory = './download/' + directory
    //var directFile = fs.readdirSync(directory);
    //console.log("Upload file from Directory: " + rootDirectory)
    // var folderinsideFolder = fs.readdirSync(rootDirectory).filter(word => fs.lstatSync('./download/'+ directory + '/' + word).isDirectory());
    // if(folderinsideFolder.length != 0){
    //   //console.log("Folder inside Folder: " + folderinsideFolder)
    //   let insideFolderDirectory = directory +'/' +folderinsideFolder[0]
    //   //console.log("Upload folder inside: " + insideFolderDirectory)
    //   uploadInsideFolder.uploadInsideMainFolder(folderid,directory)
    // }
    var directFile = fs.readdirSync(rootDirectory).filter(word => fs.lstatSync(rootDirectory + '/' + word).isFile());
    //console.log("Upload these files inside Folder: " + directFile)
    
        const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
        const TOKEN_PATH = 'token.json';
        // Load client secrets from a local file.
        fs.readFile('credentials.json', (err, content) => {
          if (err) return console.log('Error loading client secret file:', err);
          // Authorize a client with credentials, then call the Google Drive API.
          authorize(JSON.parse(content), listFiles);
        });
        

        function authorize(credentials, callback) {
          const {client_secret, client_id, redirect_uris} = credentials.installed;
          const oAuth2Client = new google.auth.OAuth2(
              client_id, client_secret, redirect_uris[0]);
        
          // Check if we have previously stored a token.
          fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
          });
        }
        

        function getAccessToken(oAuth2Client, callback) {
          const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
          });
          console.log('Authorize this app by visiting this url:', authUrl);
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
              if (err) return console.error('Error retrieving access token', err);
              oAuth2Client.setCredentials(token);
              // Store the token to disk for later program executions
              fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
              });
              callback(oAuth2Client);
            });
          });
        }
 
        function listFiles(auth) {
          const drive = google.drive({version: 'v3', auth});
          //console.log("Iside Google listFile")
          function myCreateFunc (fileMetadata,media) {
            return new Promise((resolve, reject) => {
                    drive.files.create({
                          resource: fileMetadata,
                          media: media,
                          fields: 'id'
                          }, function callback(err, fileId) {
                            if(err){
                                reject(err);
                            }
                            console.log("Done file: " + fileMetadata.name)
                            resolve(fileId)
                    })
            });
            } 
            async function uploadingFile() {
              //console.log("inside UploadingFile")
                for (file of directFile) {
                  console.log('Uploading file: '+ file)
                  var fileMetadata = {
                    'name': file,
                       parents: [folderid]
                  };
                  var media = {
                    body: fs.createReadStream(rootDirectory + '/'+file)
                  };
                await myCreateFunc(fileMetadata,media)
                }
              }
              
           uploadingFile();

        }
}