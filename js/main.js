import { Canvas } from "./canvas.js";
import { debug } from "./debug.js";
import { Game } from "./game.js";
import { GameLoop } from "./game_loop.js";
import { Games, GameTypes } from "./game_menu.js";
GameLoop.init();

/**
 * @type {Game}
 */
var currentGame;

window.mainMenu = function () {
  if (currentGame !== undefined) {
    currentGame.cleanup();
  }
  document.body.innerHTML = "";
  var container = document.createElement("div");
  container.className = "main-menu";
  container.innerHTML = `
  <h1>Desktop Games</h1>
  <div class="game-buttons">
    <div id="onePlayer" class="game-column">
      <h4>One Player</h4>
    </div>
    <div id="twoPlayer" class="game-column">
      <h4>Two Player</h4>
    </div>
  </div>
  `;
  document.body.appendChild(container);
  var onePlayer = document.getElementById("onePlayer");
  var twoPlayer = document.getElementById("twoPlayer");
  for (const game of Games) {
    var button = document.createElement("button");
    button.addEventListener("click", window.startGame.bind(null, game.game));
    button.textContent = game.name;
    button.id = game.name.replace(" ", "-");
    button.className = "menu-button";
    if (game.type === GameTypes.OnePlayer) {
      onePlayer.appendChild(button);
    } else if (game.type === GameTypes.TwoPlayer) {
      twoPlayer.appendChild(button);
    }
  }
};

window.startGame = function (game) {
  document.body.innerHTML = `
        <div class="container">
            <div class="canvas-container">
                <canvas class="canvas" id="canvas"></canvas>
            </div>
        </div>
    `;
  var canvasElement = document.getElementById("canvas");
  var canvas = new Canvas(canvasElement);
  currentGame = new game(canvas);
};
if (debug.fastStart === "none") {
  window.mainMenu();
} else {
  window.startGame(Games.find((game) => game.name === debug.fastStart).game);
}
