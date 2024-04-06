<script setup lang="ts">
import { PagedList } from "models/pagination.model";
import { useFetch, useRuntimeConfig } from "nuxt/app";
import { PagedNewsItemDto } from "~/models/news.model";

const $config = useRuntimeConfig();
const apiURL = $config.public.apiURL
const getMostViewNewsList = async () => {
  const { data: data } = await useFetch<PagedList<PagedNewsItemDto>>("/api/news", {
    baseURL: apiURL,
    params: {
      page: 1,
      size: 8,
    }
  });
  return data;
}
const mostViewNewsList = await getMostViewNewsList();

</script>

<template>
  <div class="sidebar-box">
    <SharedHeaderSidebarItem header-title="Bài Viết Tiêu Biểu" />
    <div class="row">
      <MostViewItem
          class="col-6"
          v-for="news in mostViewNewsList?.items"
          :news="news"
      />
    </div>
  </div>
</template>

<style scoped>

</style>