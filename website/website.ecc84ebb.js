// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({10:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SCREEN_WIDTH = 320;
var SCREEN_HEIGHT = 240;

// Graphics
function toHexPart(val) {
  return val.toString(16).padStart(2, "0");
}

function toHexColor(r, g, b) {
  return "#" + [r, g, b].map(toHexPart).join("");
}

var Renderer = function () {
  function Renderer(target, game) {
    _classCallCheck(this, Renderer);

    this.game = game;
    var canvas = document.createElement("canvas");
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    document.querySelector(target).appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  _createClass(Renderer, [{
    key: "fill",
    value: function fill(r, g, b) {
      this.ctx.save();
      this.ctx.fillStyle = toHexColor(r, g, b);
      this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      this.ctx.restore();
    }
  }, {
    key: "drawPixel",
    value: function drawPixel(x, y, r, g, b, a) {
      this.ctx.save();
      this.ctx.fillStyle = toHexColor(r, g, b);
      this.ctx.globalAlpha = a / 255;
      this.ctx.fillRect(x, y, 1, 1);
      this.ctx.restore();
    }
  }, {
    key: "drawPixels",
    value: function drawPixels(x, y, w, h, pixelsPtr) {
      var pixels = new Uint8ClampedArray(this.game.getMemory());
      var data = new ImageData(pixels.slice(pixelsPtr, pixelsPtr + w * h * 4), w, h);
      this.ctx.putImageData(data, x, y);
    }
  }, {
    key: "exportAPI",
    value: function exportAPI() {
      return {
        graphics_fill: this.fill.bind(this),
        graphics_draw_pixel: this.drawPixel.bind(this),
        graphics_draw_pixels: this.drawPixels.bind(this)
      };
    }
  }]);

  return Renderer;
}();

// Inputs

var KEYS = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
  START: 4,
  A: 5,
  B: 6
};

var KEYBOARD_BINDINGS = {
  ArrowLeft: KEYS.LEFT,
  ArrowRight: KEYS.RIGHT,
  ArrowUp: KEYS.UP,
  ArrowDown: KEYS.DOWN,
  Enter: KEYS.START,
  Space: KEYS.A,
  Control: KEYS.B
};

var Input = function () {
  function Input(game) {
    _classCallCheck(this, Input);

    this.game = game;
    this.pressedKeys = new Set();
  }

  _createClass(Input, [{
    key: "press",
    value: function press(key) {
      if (this.game.cartridge.instance.exports.on_key_press && !this.pressedKeys.has(key)) {
        this.game.cartridge.instance.exports.on_key_press(key);
        this.pressedKeys.add(key);
      }
    }
  }, {
    key: "release",
    value: function release(key) {
      if (this.game.cartridge.instance.exports.on_key_release && this.pressedKeys.has(key)) {
        this.game.cartridge.instance.exports.on_key_release(key);
        this.pressedKeys.delete(key);
      }
    }
  }, {
    key: "bindToKeyboard",
    value: function bindToKeyboard(targetNode) {
      var _this = this;

      targetNode.addEventListener("keydown", function (evt) {
        if (evt.key in KEYBOARD_BINDINGS) {
          _this.press(KEYBOARD_BINDINGS[evt.key]);
        }
      });

      targetNode.addEventListener("keyup", function (evt) {
        if (evt.key in KEYBOARD_BINDINGS) {
          _this.release(KEYBOARD_BINDINGS[evt.key]);
        }
      });
    }
  }, {
    key: "exportAPI",
    value: function exportAPI() {
      return {};
    }
  }]);

  return Input;
}();

// Main API


var fps = 60;
var iterStep = 1000 / fps;

var Console = exports.Console = function () {
  function Console(target) {
    _classCallCheck(this, Console);

    this.renderer = new Renderer(target, this);
    this.cartridge = null;
    this.lastIterTime = null;
    this.timeCount = 0;
    this.input = new Input(this);
  }

  _createClass(Console, [{
    key: "getMemory",
    value: function getMemory() {
      return this.cartridge.instance.exports.memory.buffer;
    }
  }, {
    key: "exportAPI",
    value: function exportAPI() {
      return Object.assign({
        debug_log: function debug_log(r) {
          console.log(r);
        },

        cosf: Math.cos,
        sinf: Math.sin
      }, this.renderer.exportAPI(), this.input.exportAPI());
    }
  }, {
    key: "load",
    value: function load(fileUrl) {
      var _this2 = this;

      return fetch(fileUrl).then(function (response) {
        return response.arrayBuffer();
      }).then(function (wasm) {
        return WebAssembly.instantiate(wasm, { env: _this2.exportAPI() });
      }).then(function (cartridge) {
        _this2.cartridge = cartridge;
        _this2.start();
      });
    }
  }, {
    key: "start",
    value: function start() {
      this.lastIterTime = null;
      this.timeCount = 0;
      this.cartridge.instance.exports.init();
      this.loop();
    }
  }, {
    key: "loop",
    value: function loop() {
      var _this3 = this;

      requestAnimationFrame(function (time) {
        if (_this3.lastIterTime !== null) {
          var delay = time - _this3.lastIterTime;
          _this3.timeCount += delay >= 1000 ? 0 : delay;

          while (_this3.timeCount > iterStep) {
            _this3.cartridge.instance.exports.update(iterStep);
            _this3.timeCount -= iterStep;
          }
        }

        _this3.lastIterTime = time;
        _this3.loop();
      });
    }
  }]);

  return Console;
}();
},{}],6:[function(require,module,exports) {
'use strict';

var _gzel = require('../gzel.js');

var game = new _gzel.Console("#canvas");
game.input.bindToKeyboard(document.body);
game.load('./breakout.wasm');
},{"../gzel.js":10}],13:[function(require,module,exports) {

var OVERLAY_ID = '__parcel__error__overlay__';

var global = (1, eval)('this');
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '44906' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[13,6])
//# sourceMappingURL=/website.ecc84ebb.map