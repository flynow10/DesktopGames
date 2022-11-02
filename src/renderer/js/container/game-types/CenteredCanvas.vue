<script setup>
import { ref } from 'vue';

const model = ref("");
</script>
<template>
  <input type="text" v-model="model">
</template>