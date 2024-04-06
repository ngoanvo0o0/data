<script setup lang="ts">
import { useFetch, useRoute, useRuntimeConfig, useSeoMeta } from "nuxt/app";
import { News1Dto, PagedNewsItemDto } from "~/models/news.model";
import { PagedList } from "~/models/pagination.model";
import { GetCategoryByIdResponse, GetCategoriesResponse } from "~/models/category.model";
import { generateSubPages } from "~/utils/functions";
import { ref } from "vue";

const $config = useRuntimeConfig();
const $route = useRoute();
const params = $route.params;
const slug = params.menuslug
const query = $route.query;
const apiURL = $config.public.apiURL;
const getNewsList = async () => {
  const {data: data} = await useFetch<PagedList<PagedNewsItemDto>>("/api/news", {
    baseURL: apiURL,
    params: {
      page: query.page || 1,
      size: 10,
      menuSlug: slug,
    }
  });
  return data;
}

const getCategory = async () => {
  const {data: data} = await useFetch<GetCategoriesResponse>(`/api/admin-console/categories`, {
    baseURL: apiURL,
    query: { slug }
  });
  return data;
}

const getMostViewNewsList = async () => {
  const { data: data } = await useFetch<PagedList<PagedNewsItemDto>>("/api/news", {
    baseURL: apiURL,
    params: {
      page: query.page || 1,
      size: 8,
    }
  });
  return data;
}

const getSubPages = (pageList: PagedList<any>): number[] => {
  return generateSubPages(pageList);
}

const [ newsList, category, mostViewNewsList ] = await Promise.all([getNewsList(), getCategory(), getMostViewNewsList()]);
const subPages = newsList.value ? getSubPages(newsList.value) : [];


const descriptionMetaTag = ref('Nguoivietplus là trang báo điện tử cung cấp bài viết, hình ảnh, video về con người và cộng đồng người Việt trên thế giới và các tin tức quốc tế, phóng sự toàn cầu.')
useSeoMeta({
  keywords: (slug as string)?.replaceAll('-', ' '),
  description: descriptionMetaTag.value,
  ogDescription: descriptionMetaTag.value
}, {
    mode: 'all'
})
</script>

<template>
  <div class="container">
    <section class="bg-body box-layout pt-20">
      <div class="row">
          <div class="col-lg-8 col-md-12">
            <div class="row">
              <div class="col-md-12">
                <div class="topic-border color-scampi mb-30">
                  <div class="topic-box-lg color-scampi">{{ category?.data?.[0]?.name }}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <template v-if="newsList && newsList.items.length > 0">
                <div class="col-xl-12 col-lg-6 col-md-6 col-sm-12" v-for="news in newsList?.items">
                  <News3Item :news="news"/>
                </div>
              </template>
              <template v-else>
                <div class="col-xl-12 col-lg-6 col-md-6 col-sm-12">
                  Không tìm thấy kết quả tìm kiếm
                </div>
              </template>
            </div>
            <div v-if="newsList && newsList.totalPage > 1" class="row mt-20-r mb-30">
              <div class="col-sm-6 col-12">
                <div class="pagination-btn-wrapper text-center--xs mb15--xs">
                  <ul>
                    <li :class="{active: 1 == newsList?.page}">
                      <a :href="`/${slug}?page=${1}`">1</a>
                    </li>
                    <li v-if="subPages.length > 0 && subPages[0] > 2"><span>...</span></li>
                    <li v-for="index in subPages" :class="{active: index == newsList?.page}">
                      <a :href="`/${slug}?page=${index}`">{{ index }}</a>
                    </li>
                    <li v-if="subPages.length > 0 && subPages[subPages.length - 1] + 1 < (newsList?.totalPage ?? 0)"><span>...</span></li>
                    <li v-if="newsList?.totalPage  && newsList?.totalPage > 1" :class="{active: newsList?.totalPage == newsList?.page}">
                      <a :href="`/${slug}?page=${newsList.totalPage}`">{{ newsList.totalPage }}</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-sm-6 col-12">
                <div class="pagination-result text-right pt-10 text-center--xs">
                  <p class="mb-none">Trang {{ newsList?.page }}</p>
                </div>
              </div>
            </div>
          </div>
        <div class="col-lg-4 col-md-12">
          <!-- <SidebarAd  class="mb-30" /> -->
          <SidebarRaoVat class="mb-30"/>
          <SidebarMostView :newses = "mostViewNewsList?.items" class="mb-30"/>

        </div>
        </div>
    </section>
    <!-- <section v-else>
      Không tìm thấy kết quả
    </section> -->
  </div>
</template>

<style scoped>

</style>
