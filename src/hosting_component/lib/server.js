'use strict';

require('dotenv').load();

console.log(process.env.HOSTING_NOTIFICATION);


var WebTorrent = require('webtorrent')

var client = new WebTorrent();
var fs = require('fs');

var zmq = require('zmq'),
hosting_notification= zmq.socket('pull');
hosting_notification.connect(process.env.HOSTING_NOTIFICATION);


hosting_notification.on('message', function(msg){
  var msg_json = JSON.parse(msg);
  if (msg_json['type']=='UPDATE'){
    //check if the directory exists
    if (fs.existsSync("/tmp/"+ msg_json['hostname'])) {
    } else {
      //create the directory
      try {
        fs.mkdirSync("/tmp/"+ msg_json['hostname']);
      } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
      }
    }
    client.download(msg_json['snapshot'], function (torrent) {
      // Got torrent metadata!
      console.log('Torrent info hash:', torrent.infoHash);
      torrent.files.forEach(function (file) {
        // Stream each file to the disk
        var source = file.createReadStream();
        var destination = fs.createWriteStream("/tmp/" + msg_json['hostname'] + "/"+file.name);
        source.pipe(destination);
      });
    });
  } else
    console.log("I AM A DELETE");


  });
