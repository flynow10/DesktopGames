<script setup lang="ts">
import ThemeManager from './components/ThemeManager.vue';
import Sidebar from './components/sidebar/Sidebar.vue';
import GameDisplay from './components/game-display/GameDisplay.vue';

import { ref } from "vue";

const zenMode = ref(false);
if (!import.meta.env.VITE_ONE_FILE) {
  window.electronAPI.onZenMode((event) => {
    zenMode.value = !zenMode.value;
    event.sender.send("zen-value", zenMode.value);
  });
}

</script>

<template>
  <ThemeManager>
    <Sidebar v-show="!zenMode" />
    <GameDisplay :zen-mode="zenMode" />
  </ThemeManager>
</template>