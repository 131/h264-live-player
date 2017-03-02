"use strict";

const fs  = require('fs');
const Readable = require('stream').Readable;
const glob  = require('glob');
const merge  = require('mout/object/merge');

const Server = require('./_server');



class FrameFeed extends Readable {
  constructor(opt) {
    super(opt);


    this.frames = glob.sync(opt.frames_dir + "/*");
    this.frames_i = 0;
    this.running = false;

  }

  _deliver(){
    this.frames_i++;
    if(this.frames_i >= this.frames.length)
      this.frames_i = 0;
    var frameName = this.frames[this.frames_i];
    var frame = fs.readFileSync(frameName);
    return frame;
  }

  _read() {
    if(!this.running) {
      console.log("Starting");
      this.running  = true;
    }

    var buf = this._deliver();
      //this.push(null);

    setTimeout( () => {
      console.log("Playing", buf.length);
      this.push(buf);
    }, 20);
  }
}


class FrameServer extends Server {

  constructor(server, opts) {
    super(server, merge({
      frames_dir   : './frames',
      fps   : 25,
      width   : 640,
      height  : 480
    }, opts));
  }

  get_feed() {
    return new FrameFeed(this.options);
  }

}



module.exports = FrameServer;
