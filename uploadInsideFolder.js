/*global folder file */

var fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const anotherUpload = require('./anotherUpload')

module.exports.uploadInsideMainFolder = (parents , mainFolder) => {
    var folders = fs.readdirSync('./download/' + mainFolder).filter(word => fs.lstatSync('./download/'+ mainFolder + '/' + word).isDirectory());
    console.log("Folder: " + folders)
      //var directory =  mainFolder +'/'+ folder
      //console.log("Upload Folder: " + directory);
      const SCOPES = ['https://www.googleapis.com/auth/drive'];
      const TOKEN_PATH = 'token.json';
      fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
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
      
      function listFiles (auth) {
        
        const drive = google.drive({version: 'v3', auth});
          function uploadFolderFunc (fileMetadata,directory) {
            return new Promise((resolve, reject) => {
                    drive.files.create({
                          resource: fileMetadata,
                          fields: 'id'
                          }, function callback(err, file) {
                            if(err){
                                reject(err);
                            }
                            console.log("Done folder: " + fileMetadata.name)
                            //uploadFile.UploadFiles(directory, file.data.id)
                            resolve(file.data.id);
                    })
            });
            
          }
          
          function Uploadfile (fileMetadata,media) {
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
                            resolve(fileId.data.id)
                    })
            });
            } 
            
            async function uploadingFile(directFile,folderid,rootDirectory ) {
              console.log("inside UploadingFile")
                for (file of directFile) {
                  console.log('Uploading file: '+ file)
                  var fileMetadata = {
                    'name': file,
                      parents: [folderid]
                  };
                  var media = {
                    body: fs.createReadStream(rootDirectory + '/'+file)
                  };
                await Uploadfile(fileMetadata,media)
                }
              }
          
          
          
        
          async function uploadingFolder() {
            for (folder of folders) {
              console.log('Uploading Folder: '+ folder)
              var directory =  mainFolder +'/'+ folder
              var fileMetadata = {
                'name': folder,
                parents: [parents],
                'mimeType': 'application/vnd.google-apps.folder'
            };
              const folderTempId = await uploadFolderFunc(fileMetadata,directory)
              console.log('--------------------' + folderTempId)
              let rootFileDirectory = './download/' + directory
              var directFile = fs.readdirSync(rootFileDirectory).filter(word => fs.lstatSync(rootFileDirectory + '/' + word).isFile());
              //uploadFile.UploadFiles(directory, file.data.id)
              //uploadingFile(directFile,folderTempId,rootFileDirectory)
              
                for (file of directFile) {
                  console.log('Uploading file: '+ file)
                  var fileMetadata = {
                    'name': file,
                      parents: [folderTempId]
                  };
                  var media = {
                    body: fs.createReadStream(rootFileDirectory + '/'+file)
                  };
                await Uploadfile(fileMetadata,media)
                }
                let folderinsideFolder = fs.readdirSync(rootFileDirectory).filter(word => fs.lstatSync('./download/'+ directory + '/' + word).isDirectory());
                if(folderinsideFolder.length != 0){
                      let insideFolderDirectory = directory +'/' + folders
                      console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG" + insideFolderDirectory)
                      //uploadingFolder(folderinsideFolder,insideFolderDirectory,folderTempId)
                      anotherUpload.Upload(folderTempId,directory)
                }
    
            }
          }
          uploadingFolder()
          .then(res => {
            console.log(res)
          })
    
          
          

        
  }

    
}