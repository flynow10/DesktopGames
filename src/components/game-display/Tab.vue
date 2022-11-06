<script setup lang="ts">
const props = defineProps<{ title: string, selected: boolean }>();
const emits = defineEmits(["close"]);
</script>
<template>
  <div :class="'tab' + (props.selected ? ' selected' : '')">
    {{ props.title }} <button @click.stop="emits('close')">✖</button>
  </div>
</template>