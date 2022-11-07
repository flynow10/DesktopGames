<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";
import { ref, onBeforeMount } from "vue";

const dark = ref(window.matchMedia("(prefers-color-scheme: dark)").matches);
const onefile = ref(import.meta.env.VITE_ONE_FILE);
onBeforeMount(async () => {
  if (!onefile.value) {
    dark.value = await window.electronAPI.getIsDarkTheme();
  }
});

if (!onefile.value) {
  window.electronAPI.onDarkModeChange((event, isDarkMode) => {
    dark.value = isDarkMode;
  });
}

</script>
<template>
  <div :class='"theme theme--" + (dark ? "dark" : "light")'>
    <slot></slot>
    <button class="theme-switcher" v-if="onefile" @click="dark = !dark">
      <component :is="dark ? Moon : Sun"></component>
    </button>
  </div>
</template>