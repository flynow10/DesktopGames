<script setup>
import { ref } from "vue";
import { useEventManger } from "../core/EventManager";
import { Game } from "../core/games/Game";
import Tab from "./Tab.vue";

const tabs = ref([]);
const { addEventListener } = useEventManger();

addEventListener("startGame", /** @param {typeof Game} game*/(game) => {
  tabs.value.push({ title: game.Metadata.name });
})
</script>
<template>
  <div class="game-container">
    <div id="tabs" class="tabs">
      <Tab v-for="(tab, index) in tabs" :key="index" :title="tab.title" />
    </div>
  </div>
</template>