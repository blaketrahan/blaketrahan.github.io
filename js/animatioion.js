(function() {
  "use strict";

  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating 
    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
    // MIT license
    (function(window) {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
     
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
     
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }( window ));
  // example : <canvas width="90" height="140" class="animatioion"></canvas>

  var Animatioion = function(options)
  {
    "use strict";
      
      // container for all the canvases
    this.canvas = [];

    this.mouse = { x:0, y:0 };
    this.hot_id = -1;

    // loop variables
      this.fps = 30;
      this.frame_duration = 1000 / this.fps;
      this.accumulator = 0;
      this.previous = 0;

      this.get_mouse_pos = function(el, event)
      {
            var rect = el.getBoundingClientRect();
            var prev_x = this.mouse.x;
            var prev_y = this.mouse.y;
            this.mouse.x =  event.clientX - rect.left;
            this.mouse.y =  event.clientY - rect.top;
            return {
                prev_x : prev_x,
                prev_y : prev_y,
                x : this.mouse.x,
                y : this.mouse.y,
            }
    }.bind(this);

    var CanvasObj = function(options)
    {
        "use strict";
        var _c = this;
        _c.id = options.id || null;
        _c.el = options.el || null;
        _c.w = 0;
        _c.h = 0;
        _c.x = 0;
        _c.y = 0;
        _c.prev_x = 0;
        _c.prev_y = 0;
        _c.render_x = 0;
        _c.render_y = 0;
        _c.amplitude = 0;
        _c.period = 2000;
        _c.width = 16;
        _c.height = 32;
        _c.speed_multiplier = 15;
        _c.is_on = false;
        _c.color = "#000000";
        _c.parent = options.parent || null;
        _c.trigger = options.trigger|| function() {
            console.log("No trigger set.");
        };
        _c.trigger.bind(_c);
            
        if (_c.el == null) {
            console.log("Error: missing canvas.");
        }

        _c.w = _c.el.width;
        _c.h = _c.el.height;
        _c.w_weighted = 10;
        _c.h_weighted = 10;

        // Fix for crisp lines
        _c.el.width = _c.w * 2;
            _c.el.height = _c.h * 2;
            _c.el.style.width = _c.w + 'px';
            _c.el.style.height = _c.h + 'px';

        if (_c.parent == null) {
            console.log("Error: missing parent.");
        }

        _c.update = function(now, start_time)
        {
            var _c = this;
          var D = now - start_time;

            var W = _c.w
            var H = _c.h;

        _c.prev_x = _c.x;
          _c.prev_y = _c.y;

          /* HORIZONTAL COLLISION */
          if (_c.h > _c.w) {
            
              if (_c.is_on) {
                _c.x = _c.parent.mouse.x - (W/2);
                  _c.render_x = _c.x;
                  _c.prev_x = _c.x;
              } else {
                  _c.x = _c.amplitude * Math.sin(D * (_c.speed_multiplier) * Math.PI / _c.period);
                  _c.amplitude *= 0.98; // slow down
                  if (_c.amplitude <= 1) _c.amplitude = 0;
                }

          /* VERTICAL COLLISION */
              } else {
              if (_c.is_on) {
                // console.log(_c.parent.mouse.y);
                _c.y = _c.parent.mouse.y - (H/2);
                  _c.render_y = _c.y;
                  _c.prev_y = _c.y;
              } else {
                  _c.y = _c.amplitude * Math.sin(D * (_c.speed_multiplier) * Math.PI / _c.period);
                  _c.amplitude *= 0.98; // slow down
                  if (_c.amplitude <= 1) _c.amplitude = 0;
                }
              }


        }.bind(_c);

        _c.display = function(alpha)
        {
            var _c = this;
          _c.render_x = (_c.x - _c.prev_x) * alpha + _c.prev_x;
          _c.render_y = (_c.y - _c.prev_y) * alpha + _c.prev_y;
          
            var W = _c.w_weighted;
            var H = _c.h_weighted;
            var ctx = _c.el.getContext("2d",{ antialias: false, depth: false });

            ctx.fillStyle = '#f9f9f9';
          ctx.fillRect(0, 0, _c.el.width, _c.el.height);
          ctx.save();
          // ctx.translate(0.5,0.5);
          ctx.scale(2,2);

          /* HORIZONTAL */
          if (_c.h > _c.w) {
            _c.h_weighted = ((_c.h_weighted * (14 - 1)) + _c.h) / 14; 
            _c.w_weighted = _c.w;
            ctx.beginPath();
                ctx.lineWidth = _c.width;
                ctx.strokeStyle = _c.color;
                ctx.moveTo(W / 2, 10);
                ctx.quadraticCurveTo(
                    (W / 2) + _c.render_x, // control x
                    H / 2,      // control y
                    W / 2,      // end x
                    H - 10);    // end y
                ctx.stroke();
              ctx.closePath();

          /* VERTICAL */
          } else {

            _c.w_weighted = ((_c.w_weighted * (14 - 1)) + _c.w) / 14; 
            _c.h_weighted = _c.h;

            // console.log(_c.render_y);
            ctx.beginPath();
                ctx.lineWidth = _c.width;
                ctx.strokeStyle = _c.color;
                ctx.moveTo(10, H / 2);
                ctx.quadraticCurveTo(
                    W / 2, // control x
                    _c.render_y + (H / 2), // control y
                    W - 10, // end x
                    H / 2); // end y
                ctx.stroke();
              ctx.closePath();
          }

            ctx.restore();
          }.bind(_c);


          _c.el.addEventListener('mousemove', function(event)
          {
            var _c = this;
            _c.parent.hot_id = _c.id;
            var mouse_info = _c.parent.get_mouse_pos(_c.el, event);
            _c.trigger(mouse_info);

        }.bind(_c), false);

        _c.el.addEventListener("mouseout", function(event)
        {
            var _c = this;
          if (_c.is_on) {
            var W = _c.w;
            var H = _c.h;
            /* HORIZONTAL */
            if (H > W) {
                _c.amplitude = W - 20;
            /* VERTICAL */
            } else {
                _c.amplitude = H - 20;
            }
            _c.amplitude *= 0.5;
            _c.is_on = false;
          }
        }.bind(_c), false);

            _c.el.addEventListener("mouseenter", function(event)
        {
            var _c = this;

                var rect = _c.el.getBoundingClientRect();
                _c.parent.prev_x =  event.clientX - rect.left;
                _c.parent.prev_y =  event.clientY - rect.top;
                _c.parent.mouse.x = _c.parent.prev_x;
                _c.parent.mouse.y = _c.parent.prev_y;

        }.bind(_c), false);

        return _c;
    };

      var el = document.getElementsByClassName("animatioion");
      for (var i = 0; i < el.length; i++)
      {
        el[i].setAttribute("aioindex",i);
        this.canvas.push( new CanvasObj(
        {
            el : el[i],
            parent : this,
            id : i,
            /* Custom trigger function */
            // "this" is the current CanvasObj
            // mouse info is prev pos, curr pos
            trigger : function(mouse_info) 
            {
                var _c = this;

                /* HORIZONTAL */
                if (_c.h > _c.w)
                {
                    var hw = (_c.w/2) + _c.x;

                    if (!_c.is_on)
                    {
                        if ((mouse_info.x > hw && mouse_info.x - hw < 10) ||
                            (mouse_info.x < hw && hw - mouse_info.x < 10))
                        {
                            // normal moving cursor
                            _c.is_on = true;
                        }
                        else if ((mouse_info.prev_x < hw && mouse_info.x >= hw) || (mouse_info.prev_x > hw && mouse_info.x <= hw))
                        {
                            // fast moving cursor
                            _c.is_on = true;
                        }
                    }
                /* VERTICAL */
                } else {
                    var hw = (_c.h/2) + _c.y;

                    if (!_c.is_on)
                    {
                        if ((mouse_info.y > hw && mouse_info.y - hw < 10) ||
                            (mouse_info.y < hw && hw - mouse_info.y < 10))
                        {
                            // normal moving cursor
                            _c.is_on = true;
                        }
                        else if ((mouse_info.prev_y < hw && mouse_info.y >= hw) || (mouse_info.prev_y > hw && mouse_info.y <= hw))
                        {
                            // fast moving cursor
                            _c.is_on = true;
                        }
                    }
                }
            }
        }) );
      }

      // window.performance polyfill
    if (typeof window.performance.now === "undefined") {
        this.get_time = (typeof Date.now === "undefined") ? new Date().getTime() : Date.now();
        } else {
            this.get_time = window.performance.now.bind(window.performance);
        }

    this.start_time = this.get_time();

    if (this.canvas.length == 0) {
      console.log("No canvases found. Removing Animatioion object.");
      return null;
    }

        // the loop
      this.loop = function() {
        requestAnimationFrame(this.loop);
        
        var now = this.get_time();
        var delta = now - this.previous;

        if (delta > 1000) {
          delta = this.frame_duration;
        }
        
        this.accumulator += delta;
        
        if (this.accumulator >= this.frame_duration)
        { 
          /* update each canvas */
                for (var i = 0; i < this.canvas.length; i++) 
                    this.canvas[i].update(this.get_time(),this.start_time);
          
          this.accumulator -= this.frame_duration;
        }
        
        var alpha = this.accumulator / this.frame_duration;
        
            for (var i = 0; i < this.canvas.length; i++) 
                this.canvas[i].display(alpha);
        
        this.previous = now;
      }.bind(this);


        this.random_color = function() {
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++ ) {
              color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        };

      // easy init and run
      this.run = function() {
        this.loop();
        return this;
      }.bind(this);
  };

  setTimeout(function(){
    var animatioion = (new Animatioion()).run();
  },900);

 })();