<script lang="ts">
export const dark = ref(window.matchMedia("(prefers-color-scheme: dark)").matches);
</script>
<script setup lang="ts">
import { useEventManger } from "@/core/EventManager";
import { Moon, Sun } from "lucide-vue-next";
import { ref, onBeforeMount } from "vue";

const onefile = ref(import.meta.env.VITE_ONE_FILE);
const { dispatchEvent } = useEventManger();
onBeforeMount(async () => {
  if (!onefile.value) {
    dark.value = await window.electronAPI.getIsDarkTheme();
  }
});
const switchMode = (isDarkMode: boolean) => {
  dark.value = isDarkMode;
  dispatchEvent("darkModeChange", isDarkMode);
}
if (!onefile.value) {
  window.electronAPI.onDarkModeChange((event, isDarkMode) => {
    switchMode(isDarkMode);
  });
}

</script>
<template>
  <div :class='"theme theme--" + (dark ? "dark" : "light")'>
    <slot></slot>
    <button class="theme-switcher" v-if="onefile" @click="switchMode(!dark)">
      <component :is="dark ? Moon : Sun"></component>
    </button>
  </div>
</template>