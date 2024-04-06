<script setup lang="ts">
const props = defineProps<{
  header: string
}>()
</script>

<template>
  <div class="topic-border color-azure-radiance mb-30">
    <div class="topic-box-lg color-azure-radiance">{{ header }}</div>
  </div>
</template>

<style scoped>

</style>
