# Motivation

This is a very simple h264 video player (that can run on live stream) for your browser.
You might use this with raspicam raw h264 stream.
This is a player around [Broadway](https://github.com/mbebenita/Broadway) Decoder, with very simple API.
NAL unit (h264 frames) are split on the server side, transported using websocket, and sent to the decoded (with frame dropping, if necessary)

[![Version](https://img.shields.io/npm/v/h264-live-player.svg)](https://www.npmjs.com/package/h264-live-player)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)


# History
* I was targetting a real-time camera video feedback (no audio/surveillance cam) in the browser
* There is no solution for "real time" mp4 video creation / playback (ffmpeg, mp4box.js, mp4parser - _boxing_ _takes_ _time_)
* Media Source Extension is a dead end (mp4 boxing is far too hard to re-create on the client side)
* [Broadway](https://github.com/mbebenita/Broadway) provide the crazy emscripten/asm build of a h264 decoder accelerated by webGL canvas
* Here is all the glue we need, enjoy ;-)


# Installation/demo
```
git clone git@github.com:131/h264-live-player.git player
cd player
npm install

node server-rpi.js    # run on a rpi for a webcam demo
node server-static.js # for sample video (static) file delivery
node server-tcp.js    # for a remote tcp (rpi video feed) sample
node server-ffmpeg    # usefull on win32 to debug the live feed (use ffmpeg & your directshow device / webcam) 

# browse to http://127.0.0.1:8080/ for a demo player

```

# Recommendations
* Broadway h264 Decoder can only work with **h264 baseline profile**
* [**Use a SANE birate**](https://www.dr-lex.be/info-stuff/videocalc.html)
* Browserify FTW
* Once you understand how to integrate the server-side, feel free to use [h264-live-player](https://www.npmjs.com/package/h264-live-player) npm package in your client side app (see vendor/)
* Use [uws](https://github.com/uWebSockets/uWebSockets) (instead of ws) as websocket server


# Credits
* [131](mailto:131.js@cloudyks.org)
* [Broadway](https://github.com/mbebenita/Broadway)
* [urbenlegend/WebStreamer](https://github.com/urbenlegend/WebStreamer)


# Keywords / shout box
raspberry, mp4box, h264, nal, raspivid, mse, media source extension, iso, raspicam, bitrate, realtime, video, mp4, ffmpeg, websocket, ws, socket.io "Let's have a beer and talk in Paris"
