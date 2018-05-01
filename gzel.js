const SCREEN_WIDTH = 240;
const SCREEN_HEIGHT = 140;

// Graphics
function toHexPart(val) {
  return val.toString(16).padStart(2, "0");
}

function toHexColor(r, g, b) {
	return "#" + [r, g, b].map(toHexPart).join("")
}

class Renderer {
  constructor(target) {
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

  exportAPI() {
    return {
      graphics_fill: this.fill.bind(this),
			graphics_draw_pixel: this.drawPixel.bind(this),
    };
  }
}

// Main API
const fps = 60;
const iterStep = 1000 / fps;

export class Console {
  constructor(target) {
    this.renderer = new Renderer(target);
    this.cartridge = null;
    this.lastIterTime = null;
    this.timeCount = 0;
  }

  exportAPI() {
    return Object.assign(
      {
        debug_log(r) {
          console.log(r);
        },
        sinf: Math.sin
      },
      this.renderer.exportAPI()
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
