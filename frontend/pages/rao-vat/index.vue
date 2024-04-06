<script setup lang="ts">
import { PagedRaoVatItemDto, } from "~/models/news.model";
import {useFetch, useRoute, useRuntimeConfig, useSeoMeta, useRouter} from "nuxt/app";
import {PagedList} from "~/models/pagination.model";
import {CategoryDto} from "~/models/category.model";
import {generateSubPages} from "~/utils/functions";
import { ref } from "vue";

const $config = useRuntimeConfig();
const $route = useRoute();
const query = $route.query;
const slug = (typeof query.categorySlug == 'object') ? query.categorySlug?.[0] : query.categorySlug;

const getSubPages = (pageList: PagedList<any>): number[] => {
  return generateSubPages(pageList);
}

const {data: raovatList} = await useFetch<PagedList<PagedRaoVatItemDto>>("/api/rao-vat", {
  baseURL: $config.public.apiURL,
  params: {
    page: query.page || 1,
    size: 8,
    categorySlug: slug
  }
});


const subPages = raovatList.value ? getSubPages(raovatList.value) : [];

const {data: categories } = await useFetch<CategoryDto[]>("/api/categories", {
  baseURL: $config.public.apiURL,
  params: {
    type: 'raovat'
  }
});

useSeoMeta({
  keywords: `rao vat${slug ? `, ${(slug as string)?.replaceAll('-', ' ')}` : ''}`,
  title: 'Rao vặt',
  ogTitle: 'Rao vặt',
  description: '',
  ogDescription: '',
  ogImage: '',
}, {
    mode: 'all'
})
const $router = useRouter()

const filterCategory = (slug: string) => {
  window.location.href = `/rao-vat?categorySlug=${slug}`
}
const generateRaoVatUrl = (page: number) => {
  return `/rao-vat?page=${page}` + (!!slug ? `&categorySlug=${slug}` : '');
}
</script>

<template>
  <div id="wrapper" class="container">
    <section class="bg-body box-layout pt-20">
      <div class="row">
        <div class="col-lg-8 col-md-12">
          <div class="row">
            <div class="col-md-12">
              <div class="mb-30">
                <button class="filter-btn" :class="category.slug === query.categorySlug && 'active' " v-for="category in categories" @click="filterCategory(category.slug)">{{category.name}}</button>
              </div>
              <div class="topic-border color-apple mb-30">
                <div class="topic-box-lg color-apple">Rao vặt</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xl-12 col-lg-6 col-md-6 col-sm-12" v-for="news in raovatList?.items">
              <News3Item :news="news" :is-rao-vat="true"/>
            </div>
          </div>
          <div v-if="raovatList && raovatList?.totalPage > 1" class="row mt-20-r mb-30">
            <div class="col-sm-6 col-12">
              <div  class="pagination-btn-wrapper text-center--xs mb15--xs">
                <ul>
                  <li :class="{active: 1 == raovatList?.page}">
                      <a :href="generateRaoVatUrl(1)">1</a>
                    </li>
                    <li v-if="subPages.length > 0 && subPages[0] > 2"><span>...</span></li>
                    <li v-for="index in subPages" :class="{active: index == raovatList?.page}">
                      <a :href="generateRaoVatUrl(index)">{{ index }}</a>
                    </li>
                    <li v-if="subPages.length > 0 && subPages[subPages.length - 1] + 1 < (raovatList?.totalPage ?? 0)"><span>...</span></li>
                    <li v-if="raovatList?.totalPage  && raovatList?.totalPage > 1" :class="{active: raovatList?.totalPage == raovatList?.page}">
                      <a :href="generateRaoVatUrl(raovatList.totalPage)">{{ raovatList.totalPage }}</a>
                    </li>
                </ul>
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="pagination-result text-right pt-10 text-center--xs">
                <p class="mb-none">Trang {{ raovatList?.page }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-12">
          <!-- <SidebarAd /> -->
          <SidebarRaoVat class="mb-30"/>
          <SidebarMostView class="mb-30"/>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

.rao-vat-category-tag {
  padding: 5px 20px;
  font-size: 14px;
  font-weight: 700;
}

.filter-btn {
  margin-right: 5px;
  margin-bottom: 8px;
  border: 1px solid #000;
  padding: 5px 20px;
  color: #000;
  transition: all 0.3s ease;
  background-color: white;
  font-weight: 600;
  outline: none !important;
}

.filter-btn.active {
  color: #E53935;
  border-color: #E53935;
}

.filter-btn:hover {
  background-color: #E53935;
  color: #fff;
  border-color: #E53935;
}
</style>
