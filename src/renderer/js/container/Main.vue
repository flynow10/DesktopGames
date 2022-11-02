<script setup>
import { computed, reactive, ref } from "vue";
import { useEventManger } from "../core/EventManager";
import { Game } from "../core/games/Game";
import Tab from "./Tab.vue";


const games = reactive(/** @type {Game[]} */(new Array(0)));
const tabs = computed(() => {
  return games.map(/** @param {Game} game */(game, index) => {
    /** @type {typeof Game} */
    var staticRef = game.constructor;
    return { title: staticRef.Metadata.name, isActive: selectedGame.game === game };
  });
});

/**@type {{game: Game}}*/
var selectedGame = reactive({ game: undefined });

const selectGame = (tabIndex) => {
  if (tabIndex === null) {
    selectedGame.game = null;
  }
  selectedGame.game = games[tabIndex];
  games.forEach(game => {
    game.selected(game === selectedGame.game)
  })
}

const closeGame = (tabIndex) => {
  var game = games[tabIndex];
  game.cleanUp();
  games.splice(tabIndex, 1);
  if (selectedGame.game === game) {
    selectGame(games.length === 0 ? null : tabIndex % games.length);
  }
}

/**
 * @param {typeof Game} game 
 */
const startGame = async (game) => {
  /**
   * @type {Game}
   */
  var newGame = new game();
  var index = games.push(newGame) - 1;
  selectGame(index);
  newGame.start();
}

const { addEventListener } = useEventManger();

addEventListener("startGame", startGame)
</script>
<template>
  <div class="game-container">
    <div id="tabs" class="tabs">
      <Tab v-for="(tab, index) in tabs" :key="index" :title="tab.title" :selected="tab.isActive"
        @click="() => { selectGame(index); }" @close="() => { closeGame(index); }" />
    </div>
    <keep-alive>
      <component :is="componentId"></component>
    </keep-alive>
  </div>
</template>