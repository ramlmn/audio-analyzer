// Source: https://github.com/darius/requestAnimationFrame/blob/master/requestAnimationFrame.js

// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license
if (!Date.now) {
  Date.now = function() {
    return new Date().getTime();
  };
  Date['now'] = Date.now;
}

(function() {
  var vendors = ['webkit', 'moz'];

  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
    window['requestAnimationFrame'] = window.requestAnimationFrame;
    window['cancelAnimationFrame'] = window.cancelAnimationFrame;
  }

  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function() {
        callback(lastTime = nextTime);
      }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
    window['requestAnimationFrame'] = window.requestAnimationFrame;
    window['cancelAnimationFrame'] = window.cancelAnimationFrame;
  }

})();


/**
 * First inspired from Adam Khoury's video (https://www.developphp.com/video/JavaScript/Analyser-Bars-Animation-HTML-Audio-API-Tutorial)
 *
 * The code for waveform from MDN(https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)
 */

(function() {

  var audioAnalyzer = function(element, o) {
    this.defaults = {
      count: 100,
      spacing: 2,
      targetEl: null,
      color: '#00adef',
      visual: 'frequencybars',
      callback: null
    };
    this.audio = element;
    this.options = {};

    for (var attr in this.defaults) {
      this.options[attr] = o[attr] || this.defaults[attr];
    }

    this.changeColors = this.changeColors.bind(this);
    this.frameLooper = this.frameLooper.bind(this);
    this.visualizeWave = this.visualizeWave.bind(this);
    this.visualizeBars = this.visualizeBars.bind(this);
    this.pauseEvent = this.pauseEvent.bind(this);
    this.playEvent = this.playEvent.bind(this);

    this.init();

    var obj = this,
      returnObj = {
        audio: obj.audio,
        visual: function(val) {
          if (val === undefined)
            return obj.options.visual;
          else
            return obj.options.visual = val;
        },
        color: function(val) {
          if (val === undefined) {
            return obj.options.color;
          } else {
            obj.options.color = val;
            obj.changeColors();
            return val;
          }
        }
      };

    if (typeof this.options.callback === 'function') {
      this.options.callback.apply(this, [returnObj])
    } else {
      return returnObj;
    }
  };

  audioAnalyzer.prototype = {

    init: function() {
      this.canvas = document.createElement('canvas');

      if (this.options.targetEl) {
        document.querySelector(this.options.targetEl).appendChild(this.canvas);
      } else {
        this.audio.parentNode.appendChild(this.canvas);
      }

      this.WIDTH = this.canvas.width = 1024;
      this.HEIGHT = this.canvas.height = 255;

      this.ctx = this.canvas.getContext('2d');

      this.changeColors();

      this.context = new(window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.context.createAnalyser();
      this.source = this.context.createMediaElementSource(this.audio);
      this.source.connect(this.analyser);
      this.analyser.connect(this.context.destination);
      this.analyser.fftSize = 2048;

      this.audio.addEventListener('play', this.playEvent, false);
      this.audio.addEventListener('pause', this.pauseEvent, false);
    },

    changeColors: function() {
      if (typeof this.options.color === "object") {
        this.grad = this.ctx.createLinearGradient(0, 0, 1, this.HEIGHT);

        for (var i = 0; i < this.options.color.length; i++)
          this.grad.addColorStop(i / (this.options.color.length - 1), this.options.color[i]);
        this.ctx.fillStyle = this.grad;

        this.ctx.strokeStyle = this.options.color[this.options.color.length - 1];
      } else {
        this.ctx.fillStyle = this.options.color;
        this.ctx.strokeStyle = this.options.color;
      }
    },

    playEvent: function() {
      this.frameLooper();
    },

    pauseEvent: function() {
      window.cancelAnimationFrame(this.reqId);
    },

    frameLooper: function() {
      if (this.options.visual == 'sinewave') {
        this.visualizeWave();
      } else if (this.options.visual == 'frequencybars') {
        this.visualizeBars();
      }
    },

    visualizeWave: function() {
      var size = this.analyser.fftSize / 2;

      this.dataArray = new Uint8Array(size);
      this.analyser.getByteTimeDomainData(this.dataArray);

      this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.lineJoin = 'round';

      for (var i = 0, x = 0; i < size; i += size / 512, x += this.WIDTH / 512) {
        var v = this.dataArray[i] / 128.0;
        var y = v * this.HEIGHT / 2;

        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      this.ctx.stroke();

      this.reqId = window.requestAnimationFrame(this.frameLooper);
    },

    visualizeBars: function() {
      var size = this.analyser.fftSize / 2;

      this.dataArray = new Uint8Array(size);
      this.analyser.getByteFrequencyData(this.dataArray);

      this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

      var offset = 1024 / this.options.count;

      for (var i = 0, j = 0; i < size; j++) {
        var x = j * offset;
        var barWidth = (offset - this.options.spacing) > 0 ? (offset - this.options.spacing) : 1;
        var barHeight = -(this.dataArray[i] * (this.HEIGHT / 255));

        i += Math.round(size / this.options.count);

        this.ctx.fillRect(x, this.HEIGHT, barWidth, barHeight);
      }

      this.reqId = window.requestAnimationFrame(this.frameLooper);
    }

  }

  // Finally attach it to the window
  window.audioAnalyzer = function(el, options) {
    // Check if a node is passed
    if (el.nodeType === undefined) {
      var arr = [];
      Array.from(document.querySelectorAll(el)).forEach(function(element) {
        arr.push(new audioAnalyzer(element, options));
      });

      if (typeof options.callback === 'function') {
        options.callback.apply(this, arr.length > 1 ? [arr] : arr);
      } else {
        return arr;
      }
    } else {
      new audioAnalyzer(document.querySelector(el), options);
    }
  }

  // Plugin for jQuery
  if (window.jQuery) {
    $.fn.audioAnalyzer = function(options) {
      this.each(function() {
        new audioAnalyzer(this, options);
      });
    }
  }

})();
