<script setup lang="ts">
import { Gamepad2, Settings } from "lucide-vue-next";
import { useEventManger } from "../../core/EventManager";
import { shallowRef, ref, nextTick } from "vue";
import GameTab from "./GameTab.vue"
const sidebarComponent = shallowRef();
const content = ref();
const componentElement = ref();
const { dispatchEvent } = useEventManger();
const onGameTabClick = () => {
  if (sidebarComponent.value === GameTab) {
    content.value.style.width = "0px";
    setTimeout(() => {
      sidebarComponent.value = null;
      dispatchEvent("toggleSidebar", false);
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
    dispatchEvent("toggleSidebar", true);
  }
}

const openSettings = () => {
  if (!import.meta.env.VITE_ONE_FILE) {
    window.electronAPI.openSettings();
  } else {
    alert("Settings are disabled on the web version");
  }
}
</script>
<template>
  <div id="sidebar" class="sidebar">
    <ul class="sidebar-tabs">
      <div class="top">
        <li @click="onGameTabClick" tabindex="-1" :class="'tab' + ((sidebarComponent === GameTab) ? ' selected' : '')"
          role="button" id="games-tab">
          <Gamepad2 class="icon" />
          <div class="active-indicator"></div>
        </li>
      </div>
      <div class="bottom">
        <li @click="openSettings" tabindex="-1" class="tab" role="button">
          <Settings class="icon" />
          <div class="active-indicator"></div>
        </li>
      </div>
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