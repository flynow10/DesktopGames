<script setup lang="ts">
import ThemeManager from './components/ThemeManager.vue';
import Sidebar from './components/sidebar/Sidebar.vue';
import GameDisplay from './components/game-display/GameDisplay.vue';

</script>

<template>
  <ThemeManager>
    <Sidebar />
    <GameDisplay />
  </ThemeManager>
</template>