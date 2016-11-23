"use strict";

const net    = require('net');
const merge  = require('mout/object/merge');

const Server = require('./_server');

class TCPFeed extends Server {

  constructor(server, opts) {
    super(server, merge({
      feed_ip   : '127.0.0.1',
      feed_port : 5001,
    }, opts));
  }

  get_feed() {

    var readStream = net.connect(this.options.feed_port, this.options.feed_ip, function(){
      console.log("remote stream ready");
    });

    return readStream;
  }

}



module.exports = TCPFeed;
