import { Game } from "./Game";
import { CenteredBlack } from "./games/CenteredBlack";
import { CenteredRed } from "./games/CenteredRed";
import { FullscreenRed } from "./games/FullscreenRed";
import { Snake } from "./games/Snake";

export const Games: typeof Game[] = [
  Snake,
  CenteredBlack,
  CenteredRed,
  FullscreenRed,
];
