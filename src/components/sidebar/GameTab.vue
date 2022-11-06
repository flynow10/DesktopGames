<script setup lang="ts">
import { Games } from '../../core/GameList';
import { shallowReactive } from 'vue';
import { useEventManger } from '../../core/EventManager';
import { Game } from "../../core/Game";
import GameButton from './GameButton.vue';
const games = shallowReactive(Games);
const { dispatchEvent } = useEventManger();
const startGame = (game: typeof Game) => {
  dispatchEvent("startGame", game);
};
</script>
<template>
  <div class="sidebar-popout game-tab">
    <div class="title-bar">
      <h4>Games</h4>
    </div>
    <ul class="game-list">
      <GameButton v-for="(game, index) in games" :key="index" :game="game" @click="startGame(game)" />
    </ul>
  </div>
</template>