<script setup lang="ts">
import { Play } from 'lucide-vue-next';
import { Game } from 'src/core/Game';
const props = defineProps<{ game: typeof Game }>();
</script>
<template>
  <li class="game">
    <button class="start-game-button">
      <Play />
    </button>
    {{ props.game.Metadata.name }}
  </li>
</template>