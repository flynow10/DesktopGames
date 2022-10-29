<script setup>
const props = defineProps(["title"]);
</script>
<template>
  <div class="tab">
    <button>X</button> {{ props.title }}
  </div>
</template>