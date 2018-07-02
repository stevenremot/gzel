import { Console } from "../../gzel.js";

const game = new Console("#canvas");
game.input.bindToKeyboard(document.body);
game
  .load("/main.wasm")
  .then(() =>
    console.log("Playing ", game.getName(), " - ", game.getVersion())
  );
