import { Console } from "gzel-core/gzel";

export class Player {
  constructor(node) {
    this.root = node;
    this.console = new Console(node);
    this.console.input.bindToKeyboard(document.body);
    this.console.renderer.setSize(640, 480);
  }

  play(fileUrl) {
    this.console.load(fileUrl).then(() => this.console.start());
  }
}
