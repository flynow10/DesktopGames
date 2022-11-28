import { Game } from "./Game";
import { Snake } from "@/core/games/snake/Snake";
import { TwentyFourtyEight } from "@/core/games/2048/2048";

export const Games: typeof Game[] = [Snake, TwentyFourtyEight];
