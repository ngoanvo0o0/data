<script setup lang="ts">
import moment from 'moment';
import { useFetch, useRoute, useRuntimeConfig, useSeoMeta } from 'nuxt/app';
import { computed, ref, onMounted } from 'vue';
import { NewsDto, PagedNewsItemDto } from '~/models/news.model';
import { replaceAllHtmlTag } from '~/utils/functions';
import {CommentDto, PagedCommentDto} from "~/models/comment.model";
import {PagedList} from "~/models/pagination.model";
import { useSchemaOrg, defineWebSite, defineWebPage, defineArticle } from '@vueuse/schema-org'

const $config = useRuntimeConfig();
const $route = useRoute();
const slug = $route.params.slug;
const apiURL = $config.public.apiURL;

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
const getNews = async () => {
  const { data: data } = await useFetch<NewsDto>(`/api/admin-console/news/${slug}`, {
    baseURL: apiURL,
  });
  return data;
}
const [ news, mostViewNewsList ] = await Promise.all([getNews(), getMostViewNewsList(), ]);
const publishedDate = computed(() => {
    const dateFormat = 'MM-DD-YYYY';
    if(!news.value?.publishDate) return moment(new Date()).format(dateFormat);

    return moment(news.value.publishDate).format(dateFormat);
})

const comments: CommentDto[] = ref([])

const loadComments = async () => {
  const {items: items} = await $fetch<PagedList<PagedCommentDto>>("/api/comments", {
    baseURL: $config.public.apiURL,
    params: {
      page: 1,
      size: 999,
      newsId: news.value?.id
    }
  });

  comments.value = items
}
onMounted( () => {
  loadComments()
})


useSeoMeta({
  keywords: news.value?.metaKeyword || '',
  title: news.value?.title || '',
  ogTitle: news.value?.title || '',
  description: replaceAllHtmlTag(news.value?.description?.slice(0, 300)) || '',
  ogDescription: replaceAllHtmlTag(news.value?.description?.slice(0, 300)) || '',
  ogImage: news.value?.imageUrl || ''
}, {
    mode: 'all'
})

useSchemaOrg([
  defineWebSite({
    name: "Nguoi viet plus"
  }),
  defineWebPage(),
  defineArticle({
    image: news.value?.imageUrl || ''
  })
])

</script>

<template>
    <div>
        <!-- Breadcrumb Area Start Here -->
        <section >
            
        </section>
        <!-- Breadcrumb Area End Here -->
        <!-- News Details Page Area Start Here -->
        <section class="bg-body box-layout">
            <div class="container">
                <div class="breadcrumbs-content">
                    <div>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.7071 2.29289C10.3166 1.90237 9.68342 1.90237 9.29289 2.29289L2.29289 9.29289C1.90237 9.68342 1.90237 10.3166 2.29289 10.7071C2.68342 11.0976 3.31658 11.0976 3.70711 10.7071L4 10.4142V17C4 17.5523 4.44772 18 5 18H7C7.55228 18 8 17.5523 8 17V15C8 14.4477 8.44772 14 9 14H11C11.5523 14 12 14.4477 12 15V17C12 17.5523 12.4477 18 13 18H15C15.5523 18 16 17.5523 16 17V10.4142L16.2929 10.7071C16.6834 11.0976 17.3166 11.0976 17.7071 10.7071C18.0976 10.3166 18.0976 9.68342 17.7071 9.29289L10.7071 2.29289Z" fill="#9CA3AF"/>
                      </svg>
                    </div>  

                    <template v-if="news?.parentCategoryName">
                        <div style="margin-bottom: -2.5px;">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z" fill="#9CA3AF"/>
                          </svg>
                        </div>

                        <span style="line-height: 1;">{{ news?.parentCategoryName}}</span>
                    </template>

                    <template v-if="news?.categoryName">
                        <div style="margin-bottom: -2.5px;">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z" fill="#9CA3AF"/>
                          </svg>
                        </div>
    
                        <span style="line-height: 1;">{{ news?.categoryName}}</span>
                    </template>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 col-md-12 mb-30">
                        <div class="news-details-layout1">
                            <div class="position-relative mb-30">
                                <nuxt-img  :src="news?.imageUrl || ' '" format="webp" :alt="news?.title" class="img-fluid" />
                                <div class="topic-box-top-sm">
                                    <div class="topic-box-sm color-cinnabar mb-20">{{ news?.categoryName }}</div>
                                </div>
                            </div>
                            <h1 class="title-semibold-dark size-c30 normal-case">{{news?.title}}</h1>
                            <ul class="post-info-dark mb-30">
                                <!-- <li>
                                    <a href="#">
                                            <span>By</span> Mark Willy</a>
                                </li> -->
                                <li>
                                    <a href="#">
                                            <i class="fa fa-calendar" aria-hidden="true"></i>{{ publishedDate }}</a>
                                </li>
                                <!-- <li>
                                    <a href="#">
                                            <i class="fa fa-eye" aria-hidden="true"></i>{{ news?.view || 1 }}</a>
                                </li> -->
                                <!-- <li>
                                    <a href="#">
                                            <i class="fa fa-comments" aria-hidden="true"></i>20</a>
                                </li> -->
                            </ul>
                            <div class="render-html">
                                <article v-html="news?.content"></article>
                            </div>

                            <!-- <ul class="blog-tags item-inline">
                                <li>Tags</li>
                                <li>
                                    <a href="#">#Business</a>
                                </li>
                                <li>
                                    <a href="#">#Magazine</a>
                                </li>
                                <li>
                                    <a href="#">#Lifestyle</a>
                                </li>
                            </ul> -->
                          <CommentArea :comments="comments" v-if="comments?.length" class="mt-30"/>
                          <CommentForm :newsId="news?.id" @createCommentSuccess="loadComments"  :title="'Bình luận'"/>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-12">
                        <!-- <SidebarAd  class="mb-30" /> -->
                        <SidebarRaoVat class="mb-30"/>
                        <SidebarMostView class="mb-30"/>
                        <SidebarAd class="mt-30" />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.breadcrumbs-content {
    display: flex; 
    align-items: flex-end;
    gap: 8px;
    padding-top: 2rem;
    padding-bottom: 2rem;
}
</style>

<style scoped>
.render-html > article ol {
  display: block;
  list-style-type: decimal;
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: 0;
  margin-right: 0;
  padding-left: 40px;
}

.render-html > article ul {
  display: block;
  list-style-type: disc;
  margin-top: 1em;
  margin-bottom: 1 em;
  margin-left: 0;
  margin-right: 0;
  padding-left: 40px;
}

.render-html > article li {
  display: list-item;
}

.render-html > article ul li {
  list-style-type: none;
}

.render-html > article ul li::before {
  content: "\2022";
  margin-right: 0.5em;
}

.render-html > article ul li.ql-indent-1::before {
  content: "\26AC";
  margin-right: 0.5em;
}

.render-html > article ul li.ql-indent-2::before {
  content: "◾";
  margin-right: 0.5em;
}

.render-html > article blockquote {
  border-left: 4px solid #ccc;
  margin-bottom: 5px;
  margin-top: 5px;
  padding-left: 16px;
}

.render-html > article pre {
  background-color: #23241f;
  color: #f8f8f2;
  overflow: visible;
  border-radius: 3px;
  margin-bottom: 5px;
  margin-top: 5px;
  padding: 5px 10px;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
}

.render-html > article :deep(.ql-indent-1) {
  padding-left: 3rem;
}

.render-html > article :deep(.ql-indent-2) {
  padding-left: calc(2 * 3rem);
}

.render-html > article :deep(.ql-indent-3) {
  padding-left: calc(3 * 3rem);
}

.render-html > article :deep(.ql-indent-4) {
  padding-left: calc(4 * 3rem);
}

.render-html > article :deep(.ql-indent-5) {
  padding-left: calc(5 * 3rem);
}

.render-html > article :deep(.ql-indent-6) {
  padding-left: calc(6 * 3rem);
}

.render-html > article :deep(.ql-indent-7) {
  padding-left: calc(7 * 3rem);
}

.render-html > article :deep(.ql-indent-8) {
  padding-left: calc(8 * 3rem);
}

.render-html > article :deep(.ql-align-right) {
  text-align: right;
}

.render-html > article :deep(.ql-align-center) {
  text-align: center;
}

.render-html > article :deep(.ql-align-justify) {
  text-align: justify;
}

.render-html > article h1 {
  font-size: calc(2 * 16px);
  line-height: calc(2 * 16px);
  margin-top: calc(0.67 * 16px);
  margin-bottom: calc(0.67 * 16px);
  font-weight: 600;
}

.render-html > article h2 {
  font-size: calc(1.5 * 16px);
  line-height: calc(1.5 * 16px);
  margin-top: calc(0.83 * 16px);
  margin-bottom: calc(0.83 * 16px);
  font-weight: 600;
}

.render-html > article h3 {
  font-size: calc(1.17 * 16px);
  line-height: calc(1.17 * 16px);
  margin-top: calc(1 * 16px);
  margin-bottom: calc(1 * 16px);
  font-weight: 600;
}

.render-html > article h4 {
  font-size: calc(1 * 16px);
  line-height: calc(1 * 16px);
  margin-top: calc(1.33 * 16px);
  margin-bottom: calc(1.33 * 16px);
  font-weight: 600;
}

.render-html > article h5 {
  font-size: calc(0.83 * 16px);
  line-height: calc(0.83 * 16px);
  margin-top: calc(1.67 * 16px);
  margin-bottom: calc(1.67 * 16px);
  font-weight: 600;
}

.render-html > article h6 {
  font-size: calc(0.67 * 16px);
  line-height: calc(0.67 * 16px);
  margin-top: calc(2.33 * 16px);
  margin-bottom: calc(2.33 * 16px);
  font-weight: 600;
}

.render-html > article p {
  display: block;
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  margin-left: 0;
  margin-right: 0;
}

.render-html > article hr {
  display: block;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  margin-left: auto;
  margin-right: auto;
  border-style: inset;
  border-width: 1px;
}

.render-html > article img {
  display: inline-block;
}

.render-html > article strong {
  font-weight: bolder !important;
}

.render-html > article sub {
  vertical-align: super;
  font-size: smaller;
}

.render-html > article a {
  text-decoration: underline;
  color: #3851e5;
}
</style>
