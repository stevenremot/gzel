import { Console } from '../../gzel.js';

console.log('Hello')

const game = new Console("#canvas");
game.input.bindToKeyboard(document.body);
game.load(
    '/main.wasm'
);
