var Class     = require('uclass');
var cp        = require('child_process');
var util      = require('util');
var Server    = require('./_server');


var RpiServer = new Class({
  Extends : Server,

  options : {
    fps : 12,
  },

  get_feed : function(){
    var msk = "raspivid -t 0 -o - -w %d -h %d -fps %d";
    var cmd = util.format(msk, this.options.width, this.options.height, this.options.fps);

    var streamer = cp.exec(cmd);
    streamer.on("exit", function(code){
      console.log("Failure", code);
    });

    return streamer.stdout;
  },

});


module.exports = RpiServer;