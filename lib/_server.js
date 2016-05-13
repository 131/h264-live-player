var Class           = require('uclass');
var Options         = require('uclass/options');
var WebSocketServer = require('ws').Server; //it's a good idea to try uws instead of ws
var Splitter        = require('stream-split');


var NALseparator    = new Buffer([0,0,0,1]);//NAL break


var _Server = new Class({
  Implements :  [Options],
  Binds  : ['new_client', 'start_feed', 'broadcast'],

  options  : {
    width : 960,
    height: 540,
  },
  
  initialize : function(server, options){
    this.setOptions(options)

    this.wss = new WebSocketServer({server: server});
    this.wss.on('connection', this.new_client);
  },
  

  start_feed : function(){
    var readStream = this.get_feed();
    this.readStream = readStream;

    readStream = readStream.pipe(new Splitter(NALseparator));
    readStream.on("data", this.broadcast);
  },

  get_feed : function(){
    throw new Error("to be implemented");
  },

  broadcast : function(data){
    this.wss.clients.forEach(function(socket) {

      if(socket.buzy)
        return;

      socket.buzy = true;
      socket.buzy = false;

      socket.send(Buffer.concat([NALseparator, data]), { binary: true}, function ack(error) {
        socket.buzy = false;
      });
    });

  },

  new_client : function(socket) {
  
    var self = this;
    console.log('New guy');

    socket.send(JSON.stringify({
      action : "init",
      width  : this.options.width,
      height : this.options.height,
    }));

    socket.on("message", function(data){
      var cmd = "" + data, action = data.split(' ')[0];
      console.log("Incomming action '%s'", action);

      if(action == "REQUESTSTREAM")
        self.start_feed();
      if(action == "STOPSTREAM")
        self.readStream.pause();
    });

    socket.on('close', function() {
      self.readStream.end();
      console.log('stopping client interval');
    });
  },


});


module.exports = _Server;
