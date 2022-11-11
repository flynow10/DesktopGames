<script setup lang="ts">
import { computed, reactive, Ref, ref, unref } from "vue";
import { useEventManger } from "../../core/EventManager";
import { Game, GameMetadata } from "../../core/Game";
import CenteredCanvas from "./display-types/CenteredCanvas.vue";
import FullscreenCanvas from "./display-types/FullscreenCanvas.vue";
import Tab from "./Tab.vue";

const props = defineProps<{
  zenMode: boolean;
}>();
const games = reactive<Game[]>([]);
const centeredCanvas = ref();
const fullscreenCanvas = ref();

const displayTypes: { [key: string]: Ref<any> } = {
  "CenteredCanvas": centeredCanvas,
  "FullscreenCanvas": fullscreenCanvas
};
const tabs = computed(() => {
  return games.map((game, index) => {
    var staticRef: typeof Game = (Object.getPrototypeOf(game).constructor);
    return { title: staticRef.Metadata.name, isActive: selectedGame.game === game };
  });
});
var selectedGame = reactive<{ game: Game | null, displayType: String | null }>({ game: null, displayType: null });
const selectGame = (tabIndex: number | null) => {
  if (tabIndex === null) {
    selectedGame.game = null;
    selectedGame.displayType = null;
  } else {
    selectedGame.game = games[tabIndex];
    var staticRef: typeof Game = (Object.getPrototypeOf(selectedGame.game).constructor);
    selectedGame.displayType = staticRef.Metadata.componentType;
  }
  games.forEach(game => {
    game.selected(game === selectedGame.game)
  })
}
const closeGame = (tabIndex: number) => {
  var game = games[tabIndex];
  game.internalCleanup();
  games.splice(tabIndex, 1);
  if (selectedGame.game === game) {
    selectGame(games.length === 0 ? null : tabIndex % games.length);
  }
}
const startGame = <T extends { new(...args: any[]): Game, Metadata: GameMetadata }>(game: T) => {
  var newGame = new game();
  var index = games.push(newGame) - 1;
  newGame.attach(unref(displayTypes[game.Metadata.componentType]));
  selectGame(index);
  newGame.start();
}
const { addEventListener } = useEventManger();
addEventListener("startGame", startGame);
if (!import.meta.env.VITE_ONE_FILE) {
  window.electronAPI.onCloseTab(() => {
    if (tabs.value.length > 0 && selectedGame.game !== null) {
      closeGame(tabs.value.findIndex(tab => tab.isActive));
    }
  });
  window.electronAPI.onNextTab(() => {
    if (tabs.value.length > 0) {
      var index = tabs.value.findIndex(tab => tab.isActive);
      selectGame((index + 1) % tabs.value.length);
    }
  });
  window.electronAPI.onPreviousTab(() => {
    if (tabs.value.length > 0) {
      var index = tabs.value.findIndex(tab => tab.isActive);
      selectGame((index - 1 + tabs.value.length) % tabs.value.length);
    }
  });
}

</script>
<template>
  <div class="game-container">
    <div id="tabs" class="tabs" v-show="!props.zenMode">
      <Tab v-for="(tab, index) in tabs" :key="index" :title="tab.title" :selected="tab.isActive"
        @click="() => { selectGame(index); }" @close="() => { closeGame(index); }" />
    </div>
    <div class="display-container">
      <CenteredCanvas :selected="selectedGame.displayType === 'CenteredCanvas'" ref="centeredCanvas" />
      <FullscreenCanvas :selected="selectedGame.displayType === 'FullscreenCanvas'" ref="fullscreenCanvas" />
    </div>
  </div>
</template>