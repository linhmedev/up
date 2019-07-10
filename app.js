const UploadFolder = require('./uploadFolder')
var WebTorrent = require('webtorrent')
var fs = require('fs');
const path = require('path')




var client = new WebTorrent()
//var magnetURI = 'magnet:?xt=urn:btih:5AE430F638AC4E96AA9C977BF0C7F82AD445F3D4&dn=%5BFreeCoursesOnline.Me%5D%20%5BPackt%5D%20Full%20Stack%20Web%20Development%20with%20Vue.js%20and%20Node%20%5BFCO%5D.torrent&tr=https://tracker.fastdownload.xyz:443/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.tiny-vps.com:6969/announce&tr=udp://tracker.pirateparty.gr:6969/announce&tr=udp://open.stealth.si:80/announce&tr=udp://hk1.opentracker.ga:6969/announce&tr=udp://tracker.cyberia.is:6969/announce&tr=https://opentracker.xyz:443/announce&tr=https://t.quic.ws:443/announce&tr=udp://9.rarbg.to:2710/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://ipv4.tracker.harry.lu:80/announce&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://bt.xxx-tracker.com:2710/announce&tr=udp://open.demonii.si:1337/announce'
function uploadTorrent (link){ 
    return new Promise ((resolve,reject) =>{
        client.add(link,{path: __dirname + '/download'}, function ontorrent (torrent) {
        console.log('Client is downloading:', torrent.infoHash)
        torrent.on('done', function(){
          console.log('torrent finished downloading')
            client.destroy(function callback (err) {
                console.log("No error: " + err)
            })
             resolve()
        })

    })
    })


}

async function Upload (link) {
    await uploadTorrent (link)
    console.log("Finish my Download Function")
    var folderDownload = fs.readdirSync('./download');
    UploadFolder.UploadFolder(folderDownload)
    console.log("Uploading to drive :)")
}

module.exports = Upload()


