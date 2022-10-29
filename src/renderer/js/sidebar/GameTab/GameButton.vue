<script setup>
import { Play } from 'lucide-vue-next';
import { Game } from '../../core/games/Game';
const props = defineProps(["game"]);
</script>
<template>
  <li class="game">
    <button class="start-game-button">
      <Play />
    </button>
    {{ props.game.Metadata.name }}
  </li>
</template>