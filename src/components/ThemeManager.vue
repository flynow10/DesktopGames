<script setup lang="ts">
import { ref, onBeforeMount } from "vue";

const dark = ref(window.matchMedia("(prefers-color-scheme: dark)").matches);

onBeforeMount(async () => {
  dark.value = await window.electronAPI.getIsDarkTheme();
});

window.electronAPI.onDarkModeChange((event, isDarkMode) => {
  dark.value = isDarkMode;
});

</script>
<template>
  <div :class='"theme theme--" + (dark ? "dark" : "light")'>
    <slot></slot>
  </div>
</template>