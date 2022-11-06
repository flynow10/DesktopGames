<script setup lang="ts">
import { useEventManger } from '../../../core/EventManager';
import { nextTick, onMounted, ref, watch } from 'vue';
const props = defineProps<{ selected: boolean }>();
const canvasElement = ref();
function resize() {
  canvasElement.value.width = canvasElement.value.offsetWidth;
  canvasElement.value.height = canvasElement.value.offsetHeight;
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

addEventListener("toggleSidebar", (event) => {
  resize();
});

onMounted(() => { resize() });
defineExpose({
  canvasElement
});
</script>
<template>
  <canvas ref="canvasElement" style="height: 100%;aspect-ratio: 1/1;" v-show="props.selected"></canvas>
</template>