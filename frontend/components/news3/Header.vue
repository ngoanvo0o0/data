<script setup lang="ts">
const props = defineProps<{
  header: string
}>()
</script>

<template>
  <div class="topic-border color-scampi mb-30">
    <div class="topic-box-lg color-scampi">{{ header }}</div>
  </div>
</template>

<style scoped>

</style>
