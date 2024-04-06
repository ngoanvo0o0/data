<script setup lang="ts">
const props = defineProps<{
  category: string
}>()
</script>

<template>
  <div class="topic-box-sm color-cod-gray mb-20">{{category}}</div>
</template>

<style scoped>

</style>
