<script setup lang="ts">
import { useEventManger } from '@/core/EventManager';
import { Canvas } from "@/core/canvas/internal";
import { onMounted, ref, watch, nextTick } from 'vue';
const props = defineProps<{ selected: boolean }>();
const canvasElement = ref<HTMLCanvasElement | null>(null);
var canvasWrapper: Canvas;
function getCanvas() {
  if (canvasWrapper) {
    return canvasWrapper;
  } else {
    throw new Error('Canvas element not found');
  }
}
function resize() {
  if (canvasElement.value) {
    canvasElement.value.style.width = "100%";
    canvasElement.value.style.height = "100%";
    canvasElement.value.width = canvasElement.value.offsetWidth;
    // -2 removes the small amount of white space at the bottom for some reason
    // TODO: Figure out why this is happening
    canvasElement.value.height = canvasElement.value.offsetHeight - 2;
  }
  if (canvasWrapper) {
    getCanvas().forceRedraw();
  }
}

window.addEventListener("resize", () => { resize(); });

watch(() => props.selected, (newValue, oldValue) => {
  if (newValue) {
    nextTick(() => {
      resize();
    });
  }
});

const { addEventListener } = useEventManger();

addEventListener("toggleSidebar", (event) => {
  resize();
});

addEventListener("zenMode", (event) => {
  setTimeout(() => {
    resize();
  }, 10000);
});

addEventListener("switchGame", (event) => {
  nextTick(() => {
    if (canvasWrapper) {
      getCanvas().forceRedraw();
    }
  })
});

onMounted(() => {
  resize();
  if (canvasElement.value) {
    canvasWrapper = new Canvas(canvasElement.value);
  } else {
    throw "Canvas element is null";
  }
});
defineExpose({
  getCanvas,
});
</script>
<template>
  <canvas ref="canvasElement" class="" v-show="props.selected"></canvas>
</template>