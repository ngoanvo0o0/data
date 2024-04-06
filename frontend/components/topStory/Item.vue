<script setup lang="ts">
import { NewsDto } from "~/models/news.model";

const props = defineProps<{
  news: NewsDto
  viewSize?: 'small' | 'large'
}>()

</script>

<template>
  <div class="img-overlay-70 img-scale-animate mb-4">
    <nuxt-img :src="news.imageUrl || ' '" :alt="news.title" format="webp" :height="news.isOutStanding ? 500 : 300" class="img-fluid width-100" :class="news.isOutStanding && 'is-out-standing'" />
    <div class="mask-content-lg" :class="viewSize === 'small' ? 'mask-content-sm' : 'mask-content-lg' ">
      <SharedBoxCategory :category="news.categoryName"/>
      <div class="post-date-light">
        <SharedNewsAuthor
            :author="news.author"
            :publishDate="news.publishDate"
        />
      </div>
      <h1 class="title-medium-light" v-if="news.isOutStanding">
        <a :href="`bai-viet/${news.slug}`">{{news.title}}</a>
      </h1>
      <h3 class="title-medium-light" v-else>
        <a :href="`bai-viet/${news.slug}`">{{news.title}}</a>
      </h3>
    </div>
  </div>
</template>

<style scoped>
.is-out-standing {
    height: 250px;
}

@media (min-width: 1024px) {
  .is-out-standing {
    height: 404px;
  }
}

</style>
