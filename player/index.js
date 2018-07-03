import { Player } from "./player";

const player = new Player("#player");
player.play(process.env.GAME_URL);
