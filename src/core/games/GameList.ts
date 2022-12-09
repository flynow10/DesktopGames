import { Game } from "./Game";
import { Snake } from "@/core/games/snake/Snake";
import { TwentyFourtyEight } from "@/core/games/2048/2048";
import { Connect4 } from "./connect4/Connect4";

export const Games: typeof Game[] = [Snake, TwentyFourtyEight, Connect4];
