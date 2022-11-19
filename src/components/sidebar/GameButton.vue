<script setup lang="ts">
import { Play } from 'lucide-vue-next';
import { Game } from '@/core/Game';
const props = defineProps<{ game: typeof Game }>();
</script>
<template>
  <li class="game">
    <Play class="start-game-button" />
    {{ props.game.Metadata.name }}
  </li>
</template>