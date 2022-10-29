<script setup>
import { Gamepad2, Settings } from "lucide-vue-next";
import { shallowRef } from "vue";
import GameTab from "./GameTab/GameTab.vue"
const sidebarComponent = shallowRef(GameTab);
const onGameTabClick = () => {
  if (sidebarComponent.value === GameTab) {
    sidebarComponent.value = null;
  } else {
    sidebarComponent.value = GameTab;
  }
}
</script>
<template>
  <div id="sidebar" class="sidebar">
    <ul class="sidebar-tabs">
      <li @click="onGameTabClick" :class="'tab' + ((sidebarComponent === GameTab) ? ' selected' : '')" role="button"
        id="games-tab">
        <Gamepad2 class="icon" />
        <div class="active-indicator"></div>
      </li>
      <li class="tab" role="button">
        <Settings class="icon" />
        <div class="active-indicator"></div>
      </li>
    </ul>
    <keep-alive>
      <component :is="sidebarComponent"></component>
    </keep-alive>
  </div>
</template>