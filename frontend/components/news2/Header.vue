<script setup lang="ts">
const props = defineProps<{
  header: string
}>()
</script>

<template>
  <div class="topic-border color-apple mb-30 width-100">
    <div class="topic-box-lg color-apple">{{ header }}</div>
  </div>
</template>

<style scoped>

</style>