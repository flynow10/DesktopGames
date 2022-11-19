<script setup lang="ts">
import ThemeManager from '@/components/ThemeManager.vue';
import Sidebar from '@/components/sidebar/Sidebar.vue';
import GameDisplay from '@/components/game-display/GameDisplay.vue';

import { ref } from "vue";
import { useEventManger } from './core/EventManager';
import Modal from './components/modal/Modal.vue';

const zenMode = ref(false);
if (!import.meta.env.VITE_ONE_FILE) {
  const { dispatchEvent } = useEventManger();
  window.electronAPI.onZenMode((event) => {
    zenMode.value = !zenMode.value;
    event.sender.send("zen-value", zenMode.value);
    dispatchEvent("zenMode", zenMode.value);
  });
}
const show = ref(true);
</script>

<template>
  <ThemeManager>
    <Sidebar v-show="!zenMode" />
    <GameDisplay :zen-mode="zenMode" />
  </ThemeManager>
</template>