<script setup lang="ts">
import { useEventManger } from '@/core/EventManager';
import { nextTick, onMounted, ref, watch } from 'vue';
import { Canvas } from '@/core/canvas/internal';
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
    canvasElement.value.width = canvasElement.value.offsetWidth;
    canvasElement.value.height = canvasElement.value.offsetHeight - 3;
  }
  if (canvasWrapper) {
    getCanvas().forceRedraw();
  }
}

watch(() => props.selected, (newValue, oldValue) => {
  if (newValue) {
    nextTick(() => {
      resize();
    });
  }
});
window.addEventListener("resize", () => { resize(); });

const { addEventListener } = useEventManger();

addEventListener("toggleSidebar", () => {
  resize();
});

addEventListener("zenMode", () => {
  resize();
});
addEventListener("switchGame", () => {
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
  <canvas ref="canvasElement" style="display: block;height: 100%;aspect-ratio: 1/1;" v-show="props.selected"></canvas>
</template>