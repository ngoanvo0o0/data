<script setup lang="ts">
import type { News1Dto, NewsDto } from "~/models/news.model";

// const props = defineProps<{
//   newses: News1Dto[]
// }>()

//   const newsOutStanding: NewsDto = props.newses[0]
/* __placeholder__ */
import type { PagedList } from "~/models/pagination.model";
import { useFetch, useRuntimeConfig } from "nuxt/app";
import type { PagedNewsItemDto } from "~/models/news.model";

const $config = useRuntimeConfig();
const apiURL = $config.public.apiURL as string
const getMostViewNewsList = async () => {
  const { data: data } = await useFetch<PagedList<PagedNewsItemDto>>("/api/news", {
    baseURL: apiURL,
    params: {
      page: 1,
      size: 10,
    }
  });

  return data
}
const mostViewNewsList = await getMostViewNewsList();

</script>

<template>
  <section class="top-story">
    <!-- <div class="wrapper"> -->
    <div class="row" style="padding-left: 15px;padding-right: 15px;">
      <div class="item col-12 col-sm-6 col-lg-4" style="padding: 0;">
        <div class="left">
          <div v-for="(item, index) in mostViewNewsList?.items.slice(0, 2)" :key="item.id" class="sub-item">
            <TopStoryItem :news="item" :isCenter="true" class="h-100" />
          </div>
        </div>
      </div>
      <div class="item col-12 col-sm-6 col-lg-4" style="padding: 0;">
        <div class="center">
          <div v-for="(item, index) in mostViewNewsList?.items.slice(2, 4)" :key="item.id" class="sub-item">
            <TopStoryItem :news="item" :isCenter="true" class="h-100" />
          </div>
        </div>
      </div>
      <div class="item col-12 col-lg-4" style="padding: 0;">
        <div class="right">
          <div v-for="(item, index) in mostViewNewsList?.items.slice(4, 6)" :key="item.id" class="sub-item">
            <TopStoryItem :news="item" :isCenter="true" class="h-100" />
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </section>
</template>

<style scoped>
.top-story {
  /* height: 500px; */
}
/* .top-story .item .sub-item img {
  object-fit: cover !important;
} */
.top-story .item>div {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-wrap: wrap;
}

.top-story .item>div .sub-item {
  height: 240px;
  padding: 5px
}

@media screen and (max-width:992px) {
  .top-story .item .right .sub-item {
    height: 310px;
  }
}

@media screen and (max-width:768px) {
  .top-story .item>div .sub-item {
    height: 250px;
  }
  .top-story .item .right .sub-item {
    height: 310px;
    padding: 10px 0;
  }
}

@media screen and (max-width:576px) {
  .top-story .item>div .sub-item {
    width: 100%;
    padding: 10px 0px;
    height: 250px;
  }
}
</style>
