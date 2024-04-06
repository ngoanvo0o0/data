<script setup lang="ts">
import { useFetch, useSeoMeta, useRoute, useRuntimeConfig } from 'nuxt/app';
import {CommentDto, PagedCommentDto} from '~/models/comment.model';
import { RaoVatDto } from "~/models/news.model";
import { PagedList } from '~/models/pagination.model';
import { replaceAllHtmlTag } from '~/utils/functions';
import { onMounted, ref } from "vue";
import { useModal } from 'vue-final-modal'
import ImagePreview from '~/components/ImagePreview.vue';
import { defineArticle, defineWebPage, defineWebSite, useSchemaOrg } from '@vueuse/schema-org';


const $config = useRuntimeConfig();
const $route = useRoute();
const slug = $route.params.slug;
const { data: data } = await useFetch<RaoVatDto>(`/api/rao-vat/${slug}`, {
  baseURL: $config.public.apiURL,
});

const comments: CommentDto[] = ref([])

const loadComments = async () => {
  const {items: items} = await $fetch<PagedList<PagedCommentDto>>("/api/comments", {
    baseURL: $config.public.apiURL,
    params: {
      page: 1,
      size: 999,
      raoVatId: data.value?.id
    }
  });

  comments.value = items
}
onMounted( () => {
  loadComments()
})

useSeoMeta({
  keywords: data.value?.metaKeyword || '',
  title: data.value?.title || '',
  ogTitle: data.value?.title || '',
  description: data.value?.description || replaceAllHtmlTag(data.value?.content?.slice(0, 300)) || '',
  ogDescription: data.value?.description || replaceAllHtmlTag(data.value?.content?.slice(0, 300)) || '',
  ogImage: data.value?.imageUrl || ''
}, {
    mode: 'all'
})

useSchemaOrg([
  defineWebSite({
    name: "Nguoi viet plus"
  }),
  defineWebPage(),
  defineArticle({
    image: data.value?.imageUrl || ''
  })
])

const openPreviewImage = (src: string ) => {
  console.log('click')
  const { open } = useModal({
    component: ImagePreview,
    attrs: {
      imageSrc: src
    },
  })
  open();
}

</script>

<template>
    <div>
        <section class="bg-body">
            <div class="container box-layout">
                <div class="breadcrumbs-content">
                    <div>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.7071 2.29289C10.3166 1.90237 9.68342 1.90237 9.29289 2.29289L2.29289 9.29289C1.90237 9.68342 1.90237 10.3166 2.29289 10.7071C2.68342 11.0976 3.31658 11.0976 3.70711 10.7071L4 10.4142V17C4 17.5523 4.44772 18 5 18H7C7.55228 18 8 17.5523 8 17V15C8 14.4477 8.44772 14 9 14H11C11.5523 14 12 14.4477 12 15V17C12 17.5523 12.4477 18 13 18H15C15.5523 18 16 17.5523 16 17V10.4142L16.2929 10.7071C16.6834 11.0976 17.3166 11.0976 17.7071 10.7071C18.0976 10.3166 18.0976 9.68342 17.7071 9.29289L10.7071 2.29289Z" fill="#9CA3AF"/>
                        </svg>
                    </div>

                    <div style="margin-bottom: -2.5px;">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z" fill="#9CA3AF"/>
                      </svg>
                    </div>

                    <span style="line-height: 1;">Rao vặt</span>
                </div>
            </div>
            <div class="container box-layout">
                <div class="row">
                    <div class="col-lg-8 col-md-12 mb-30">
                        <div class="news-details-layout1">
                            <div class="position-relative mb-30">
                                <nuxt-img  :src="data?.imageUrl || ' '" format="webp" :alt="data?.title" class="img-fluid" />
                                <div class="topic-box-top-sm">
                                    <div class="topic-box-sm color-cinnabar mb-20">{{ data?.categoryName }}</div>
                                </div>
                            </div>
                            <h1 class="title-semibold-dark size-c30 normal-case">{{data?.title}}</h1>
                            <div class="render-html">
                                <article v-html="data?.content"></article>
                            </div>

                            <div class="mt-30">
                              <h2 class="title-semibold-dark size-xl">Hình ảnh</h2>
                              <div class="slider-wrapper">
                                <div class="slider">
                                  <div v-for="item in data?.extraImages"
                                        @click="openPreviewImage(item)"
                                        class="slider-item">
                                      <img loading="lazy"
                                          :alt="data?.title"
                                          style="width: 100%; object-fit: cover;"
                                          :src="item" alt="ad"
                                          class="img-fluid"/>
                                    </div>
                                </div>
                              </div>
                            </div>

                            <div class="contact-card mt-30">
                              <h2>Thông tin liên hệ</h2>
                              <hr>
                              <p><strong>Tên người liên hệ:</strong> {{data?.contactName}}</p>
                              <p v-if="data?.address"><strong>Địa chỉ:</strong> {{data?.address}}</p>
                              <p v-if="data?.phoneNumber"><strong>Số điện thoại:</strong> <a :href='`tel:${data?.phoneNumber}`'>{{data?.phoneNumber}}</a></p>
                              <p v-if="data?.facebook"><strong>Liên kết Facebook:</strong> <a :href='`https://www.facebook.com/${data?.facebook}`' target="_blank">fb.com/{{data?.facebook}}</a></p>
                              <p v-if="data?.email"><strong>Email:</strong> <a :href="`mailto:${data?.email}`" target="_blank">{{data?.email}}</a></p>
                              <p v-if="data?.websiteUrl"><strong>Website:</strong> <a :href="data?.websiteUrl" target="_blank">{{data?.websiteUrl}}</a></p>
                            </div>

                            <CommentArea :comments="comments" v-if="comments?.length" class="mt-30"/>
                            <CommentForm :rao-vat-id="data?.id" @createCommentSuccess="loadComments" :title="'Bình luận'"/>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-12">
                        <!-- <SidebarAd /> -->
                        <SidebarRaoVat class="mb-30"/>
                        <SidebarMostView class="mb-30"/>
                        <SidebarAd class="mt-30" />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped lang="scss">
.slider-wrapper {
  border: 1px solid #D1D5DB;
  padding: 12px 16px;
  width: 100%;
  border-radius: 4px;
}
.slider {
  display: flex;
  gap: 16px;
  height: 200px;
  overflow: auto;
  // -ms-overflow-style: none;  /* IE and Edge */
  // scrollbar-width: none;  /* Firefox */
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  .slider-item {
    width: 100%;
    display: inline-block;
    flex-shrink: 0;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
// .slider::-webkit-scrollbar {
//     display: none;
// }

slides::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.slides::-webkit-scrollbar-thumb {
  // background: black;
  border-radius: 10px;
}
.slides::-webkit-scrollbar-track {
  background: transparent;
}

@media (min-width: 768px) {
  .slider {
    .slider-item {
      width: 35%;
    }
  }
}

@media (min-width: 992px) {
  .slider {
    .slider-item {
      width: 25%;
    }
  }
}
  
.contact-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.contact-card h2 {
  color: #e53935;
  text-align: center;
  margin-bottom: 20px;
}

.contact-card p {
  font-size: 16px;
  word-wrap: break-word;
}

.contact-card p strong {
  font-weight: bold;
}

.contact-card a {
  color: #17a2b8;
}
.breadcrumbs-content {
    display: flex; 
    align-items: flex-end;
    gap: 8px;
    padding-top: 2rem;
    padding-bottom: 2rem;
}

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
