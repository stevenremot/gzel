const SCREEN_WIDTH = 320;
const SCREEN_HEIGHT = 240;

// Graphics
function toHexPart(val) {
  return val.toString(16).padStart(2, "0");
}

function toHexColor(r, g, b) {
  return "#" + [r, g, b].map(toHexPart).join("");
}

class Renderer {
  constructor(target, game) {
    this.game = game;
    const canvas = document.createElement("canvas");
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    document.querySelector(target).appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  fill(r, g, b) {
    this.ctx.save();
    this.ctx.fillStyle = toHexColor(r, g, b);
    this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.ctx.restore();
  }

  drawPixel(x, y, r, g, b, a) {
    this.ctx.save();
    this.ctx.fillStyle = toHexColor(r, g, b);
    this.ctx.globalAlpha = a / 255;
    this.ctx.fillRect(x, y, 1, 1);
    this.ctx.restore();
  }

  drawPixels(x, y, w, h, pixelsPtr) {
    const pixels = new Uint8ClampedArray(this.game.getMemory());
    const data = new ImageData(
      pixels.slice(pixelsPtr, pixelsPtr + w * h * 4),
      w,
      h
    );
    this.ctx.putImageData(data, x, y);
  }

  exportAPI() {
    return {
      graphics_fill: this.fill.bind(this),
      graphics_draw_pixel: this.drawPixel.bind(this),
      graphics_draw_pixels: this.drawPixels.bind(this)
    };
  }
}

// Inputs

const KEYS = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3,
	START: 4,
	A: 5,
	B: 6,
};

const KEYBOARD_BINDINGS = {
	'ArrowLeft': KEYS.LEFT,
	'ArrowRight': KEYS.RIGHT,
	'ArrowUp': KEYS.UP,
	'ArrowDown': KEYS.DOWN,
	'Enter': KEYS.START,
	'Space': KEYS.A,
	'Control': KEYS.B,
}

class Input {
	constructor(game) {
		this.game = game;
	}

	press(key) {
		if (this.game.cartridge.instance.exports.on_key_press) {
			this.game.cartridge.instance.exports.on_key_press(key);
		}
	}

	release(key) {
		if (this.game.cartridge.instance.exports.on_key_release) {
			this.game.cartridge.instance.exports.on_key_release(key);
		}
	}

	bindToKeyboard(targetNode) {
		targetNode.addEventListener('keydown', evt => {
			if (evt.key in KEYBOARD_BINDINGS) {
				this.press(KEYBOARD_BINDINGS[evt.key]);
			}
		});

		targetNode.addEventListener('keyup', evt => {
			if (evt.key in KEYBOARD_BINDINGS) {
				this.release(KEYBOARD_BINDINGS[evt.key]);
			}
		});
	}

	exportAPI() {
		return {};
	}
}

// Main API
const fps = 60;
const iterStep = 1000 / fps;

export class Console {
  constructor(target) {
    this.renderer = new Renderer(target, this);
    this.cartridge = null;
    this.lastIterTime = null;
    this.timeCount = 0;
		this.input = new Input(this);
  }

  getMemory() {
    return this.cartridge.instance.exports.memory.buffer;
  }

  exportAPI() {
    return Object.assign(
      {
        debug_log(r) {
          console.log(r);
        },
        sinf: Math.sin
      },
      this.renderer.exportAPI(),
			this.input.exportAPI(),
    );
  }

  load(fileUrl) {
    return fetch(fileUrl)
      .then(response => response.arrayBuffer())
      .then(wasm => WebAssembly.instantiate(wasm, { env: this.exportAPI() }))
      .then(cartridge => {
        this.cartridge = cartridge;
        this.start();
      });
  }

  start() {
    this.lastIterTime = null;
    this.timeCount = 0;
    this.cartridge.instance.exports.init();
    this.loop();
  }

  loop() {
    requestAnimationFrame(time => {
      if (this.lastIterTime !== null) {
        const delay = time - this.lastIterTime;
        this.timeCount += delay >= 1000 ? 0 : delay;

        while (this.timeCount > iterStep) {
          this.cartridge.instance.exports.update(iterStep);
          this.timeCount -= iterStep;
        }
      }

      this.lastIterTime = time;
      this.loop();
    });
  }
}
