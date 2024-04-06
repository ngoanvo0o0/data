<script setup lang="ts">
import {NewsDto, PagedRaoVatItemDto} from "~/models/news.model";
import {useFetch, useRoute, useRuntimeConfig} from "#app";
import {PagedList} from "~/models/pagination.model";

const $config = useRuntimeConfig();
const $route = useRoute();
const {data: data} = await useFetch<PagedList<PagedRaoVatItemDto>>("/api/rao-vat", {
  baseURL: $config.public.apiURL,
  params: {
    page: 1,
    size: 8
  }
});
</script>

<template>
  <div class="sidebar-box">
    <SharedHeaderSidebarItem header-title="Rao vặt" />
    <div class="add-item5-lg">
      <RaoVatItem
        v-for="news in data?.items"
        :news="news"
      />
    </div>
  </div>
</template>

<style scoped>

</style>