<script setup lang="ts">
import {NewsDto} from "~/models/news.model";

const props = defineProps<{
  news: NewsDto
}>()
</script>

<template>
  <div class="img-overlay-70 img-scale-animate mb-30">
    <div class="mask-content-xs">
      <div class="post-date-light d-none d-sm-block">
        <SharedNewsAuthor
            :author="news.author"
            :publishDate="news.publishDate"
        />
      </div>
      <h3 class="title-medium-light">
        <a :href="`bai-viet/${news.slug}`">{{news.title}} </a>
      </h3>
    </div>
    <nuxt-img  :src="news.imageUrl || ' '" format="webp" height="500" :alt="news.title" class="img-fluid width-100" />
  </div>
</template>

<style scoped>

</style>