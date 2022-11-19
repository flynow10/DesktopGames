<template>
  <div class="modal" @click="close">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">{{ props.title }}</h2>
        <button class="modal-close" @click="close">
          <X />
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { X } from "lucide-vue-next";
const props = defineProps<{
  title: string
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const close = () => {
  emit("close");
};

defineExpose({
  close,
});

</script>