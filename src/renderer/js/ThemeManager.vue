<script setup>
import { Moon, Sun } from "lucide-vue-next";
import { ref } from "vue";
const themes = [
  'dark',
  'light'
]
const theme = ref(themes[0]);
const nextTheme = (nextTheme = null) => {
  if (nextTheme === null) {
    nextTheme = themes[(themes.indexOf(theme.value) + 1) % themes.length]
  }
  theme.value = nextTheme;
}
</script>
<template>
  <div :class='"theme theme--" + theme'>
    <slot></slot>
    <button class="theme-switcher" @click="() => { nextTheme(); }">
      <component :is="theme === 'light' ? Moon : Sun"></component>
    </button>
  </div>
</template>