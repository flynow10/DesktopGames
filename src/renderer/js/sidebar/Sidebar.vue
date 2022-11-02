<script setup>
import { Gamepad2, Settings } from "lucide-vue-next";
import { shallowRef, ref, nextTick } from "vue";
import GameTab from "./GameTab/GameTab.vue"
const sidebarComponent = shallowRef();
const content = ref();
const componentElement = ref();
const onGameTabClick = () => {
  if (sidebarComponent.value === GameTab) {
    content.value.style.width = "0px";
    setTimeout(() => {
      sidebarComponent.value = null;
    }, 200);
  } else {
    sidebarComponent.value = GameTab;
    content.value.style.width = "unset";
    nextTick(() => {
      content.value.style.width = "0px";
      nextTick(() => {
        content.value.style.width = window.getComputedStyle(componentElement.value).width
      })
    })
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
    <div class="content" ref="content">
      <div style="width: fit-content; height: 100%;" ref="componentElement">
        <keep-alive>
          <component :is="sidebarComponent"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>