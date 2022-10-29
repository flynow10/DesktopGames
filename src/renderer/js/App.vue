<script setup>
import GameContainer from "./container/GameContainer.vue";
import Sidebar from "./sidebar/Sidebar.vue"
import ThemeManager from "./ThemeManager.vue";

</script>
<template>
  <ThemeManager>
    <Sidebar />
    <GameContainer />
  </ThemeManager>
</template>