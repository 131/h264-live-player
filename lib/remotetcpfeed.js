var Class  = require('uclass');
var net    = require('net');
var Server = require('./_server');

var TCPFeed = new Class({
  Extends : Server,

  options : {
    feed_ip   : '127.0.0.1',
    feed_port : 5001,
  },

  get_feed : function(){

    var readStream = net.connect(this.options.feed_port, this.options.feed_ip, function(){
      console.log("remote stream ready");
    });

    return readStream;
  },

});



module.exports = TCPFeed;
