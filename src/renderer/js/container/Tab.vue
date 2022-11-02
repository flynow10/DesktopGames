<script setup>
const props = defineProps(["title", "selected"]);
const emits = defineEmits(["close"]);
</script>
<template>
  <div :class="'tab' + (props.selected ? ' selected' : '')">
    {{ props.title }} <button @click.stop="emits('close')">✖</button>
  </div>
</template>