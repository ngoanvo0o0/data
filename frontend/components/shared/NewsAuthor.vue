<script setup lang="ts">
const props = defineProps<{
  author?: string,
  publishDate?: string | Date
}>()

</script>

<template>
  <ul>
    <!-- <li v-if="author">
      <span>by</span>
      <a href="#">{{author}}</a>
    </li> -->
    <li v-if="publishDate">
        <span>
          <i class="fa fa-calendar" aria-hidden="true"></i>
        </span>{{formatNewsDate(publishDate)}}
    </li>
  </ul>
</template>

<style scoped>

</style>
