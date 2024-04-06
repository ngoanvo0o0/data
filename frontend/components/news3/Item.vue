<script setup lang="ts">
import { useRouter } from "nuxt/app";
import {NewsDto} from "~/models/news.model";

const $router = useRouter()
const props = defineProps<{
  news: NewsDto,
  isRaoVat?: boolean
}>()

const redirectPage = () => {
  const slug = props.news.slug
  if (!props.isRaoVat) {
    $router.push({ path: `bai-viet/${slug}` })
    return
  }
  $router.push({ path: `rao-vat/${slug}` })
}
</script>

<template>
  <div class="media media-none--lg mb-30">
    <div class="position-relative width-40">
      <NuxtLink :to="`${!isRaoVat ? '/bai-viet' : '/rao-vat'}/${news.slug}`" class="img-opacity-hover">
        <nuxt-img  :src="news.imageUrl || ' '" format="webp" height="500" alt="news" class="img-fluid" style="height: 170px; object-fit: cover; width: 100%;" />
      </NuxtLink>
    </div>
    <div class="media-body p-mb-none-child media-margin30 d-flex flex-column">
      <div class="post-date-dark">
        <SharedNewsAuthor
            :author="news.author"
            :publishDate="news.publishDate"
        />
      </div>
      <h3 class="title-semibold-dark size-lg mb-15">
        <NuxtLink :to="`${!isRaoVat ? '/bai-viet' : '/rao-vat'}/${news.slug}`">
          {{news.title}}
        </NuxtLink>
      </h3>
      <p v-if="!isRaoVat" class="elipsis-3-lines">{{news.description}}
      </p>
      <div v-else class="mt-auto">
        <button class="btn-contact">
          <NuxtLink :to="`${!isRaoVat ? '/bai-viet' : '/rao-vat'}/${news.slug}`" style="color: white;">Chi tiết</NuxtLink>
        </button>
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
  width: 130px;
  height: 35px;
}
</style>
