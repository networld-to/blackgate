'use strict';

require('dotenv').load();

var log = require('../lib/logger');

var WebTorrent = require('webtorrent');
var client = new WebTorrent();
var fs = require('fs');
var storage_prefix = process.env.STORAGE_PREFIX;

var zmq = require('zmq'),
    hosting_notification= zmq.socket('pull');
hosting_notification.connect(process.env.HOSTING_NOTIFICATION);

hosting_notification.on('message', function(msg){
  var msg_json = JSON.parse(msg);
  if (msg_json['type'] == 'UPDATE'){
    //check if the directory exists
    if (fs.existsSync(storage_prefix + msg_json['hostname'])) {
    } else {
      //create the directory
      try {
        fs.mkdirSync(storage_prefix + msg_json['hostname']);
      } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
      }
    }
    client.download(msg_json['snapshot'], function (torrent) {
      // Got torrent metadata!
      log.info('Torrent info hash:', torrent.infoHash);
      torrent.files.forEach(function (file) {
        // Stream each file to the disk
        var source = file.createReadStream();
        var destination = fs.createWriteStream(storage_prefix + msg_json['hostname'] + "/"+file.name);
        source.pipe(destination);
      });
    });
  } else if ( msg_json['type'] == 'DELETE' ) {
    log.error("TODO: Implement the DELETE type.");
  } else {
    log.warn("Ignoring unkown message type '" + msg_json['type'] + "'");
  }
});

log.info("[*] Listening for incoming message on '" + process.env.HOSTING_NOTIFICATION + "'");
