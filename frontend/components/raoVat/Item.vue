<script setup lang="ts">
import { NewsDto } from "~/models/news.model";

const props = defineProps<{
  news: NewsDto
}>()

</script>

<template>
  <div class="media bg-body item-shadow-gray mb30-list">
    <a class="img-opacity-hover width40-lg" :href="`/rao-vat/${news.slug}`">
      <nuxt-img  :src="news.imageUrl || ' '" format="webp" height="500" :alt="news.title" class="rao-vat-img" />
    </a>
    <div class="media-body">
      <div class="post-date-dark">
        <SharedNewsAuthor
            :publishDate="news.publishDate"
        />
      </div>
      <h3 class="title-medium-dark mb-none">
        <a :href="`/rao-vat/${news.slug}`">{{news.title}}</a>
      </h3>
      <div>
        <a :href="`/rao-vat/${news.slug}`" style="color: white;" class="btn-contact">Chi tiết</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-contact {
  color: white;
  font-size: 12px;
  background-color: #4F46E5;
  border: none;
  padding: 2px 10px;
  display: inline-block;
}

  .rao-vat-img {
    object-fit: cover;
    width: 124px;
    height: 108px;
  }
</style>