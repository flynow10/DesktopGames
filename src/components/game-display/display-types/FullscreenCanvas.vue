<script setup lang="ts">
import { useEventManger } from '../../../core/EventManager';
import { onMounted, ref, watch, nextTick } from 'vue';
const props = defineProps<{ selected: boolean }>();
const canvasElement = ref();
function resize() {
  canvasElement.value.style.width = "100%";
  canvasElement.value.style.height = "100%";
  canvasElement.value.width = canvasElement.value.offsetWidth;
  // -2 removes the small amount of white space at the bottom for some reason
  // TODO: Figure out why this is happening
  canvasElement.value.height = canvasElement.value.offsetHeight - 2;
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
onMounted(() => { resize() });
defineExpose({
  canvasElement
});
</script>
<template>
  <canvas ref="canvasElement" class="" v-show="props.selected"></canvas>
</template>