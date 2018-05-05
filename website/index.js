import { Console } from '../gzel.js';

const game = new Console("#canvas");
game.input.bindToKeyboard(document.body);
game.load(
    './breakout.wasm'
);
