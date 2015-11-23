var fs           = require('fs');
var Throttle     = require('stream-throttle').Throttle;
//var fileSizeSync = require('nyks/fs/fileSizeSync');
var Class        = require('uclass');
var Server       = require('./_server');


var StaticFeed = new Class({
  Extends : Server,

  options : {
    video_path     : null,
    video_duration : 0,
  },


  get_feed : function(){
    var source = this.options.video_path;


      //throttle for "real time simulation"
    var sourceThrottleRate = Math.floor(fs.statSync(source)['size'] / this.options.video_duration);
    console.log("Generate a throttle rate of %s kBps", Math.floor(sourceThrottleRate/1024));

    var readStream = fs.createReadStream(source);
    readStream = readStream.pipe(new Throttle({rate: sourceThrottleRate}));

    console.log("Generate a static feed from ", source);
    return readStream;
  },

});



module.exports = StaticFeed;
