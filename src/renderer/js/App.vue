<script setup>
import Main from "./container/Main.vue";
import Sidebar from "./sidebar/Sidebar.vue"
import ThemeManager from "./ThemeManager.vue";

</script>
<template>
  <ThemeManager>
    <Sidebar />
    <Main />
  </ThemeManager>
</template>