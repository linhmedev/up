[ 'DownloadDrive' ]
//Folder Id:  14s0_kwxuJWPq0SgUf45I7-7MAIsON8WF



  drive.files.create({
  resource: fileMetadata,
  media: media,
  fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id: ', file.data.id);
    }
  });
  



        console.log("Upload file: "+directory+'/'+file)
        var folderId = folderid;
        var fileMetadata = {
          'name': file,
          parents: [folderId]
        };
        var media = {
          body: fs.createReadStream(rootDirectory + '/'+file)
        };
        
        directFile.forEach(file => {
          
          
              folders.forEach(folder =>{
                
                
                
                        var fileMetadata = {
        'name': folder,
        parents: [parents],
        'mimeType': 'application/vnd.google-apps.folder'
      };