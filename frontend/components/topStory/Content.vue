<script setup lang="ts">
import {News1Dto, NewsDto} from "~/models/news.model";

const props = defineProps<{
  newses: News1Dto[]
}>()

  const newsOutStanding: NewsDto = props.newses[0]

</script>

<template>
  <section class="container">
    <div class="bg-body box-layout">
      <div class="section-space-bottom-less4">
        <div class="row tab-space2">
          <div class="col-lg-5 col-md-12">
            <TopStoryItem
                :news="{...newsOutStanding, isOutStanding: true}"
            />
          </div>
          <div class="col-lg-7 col-md-12">
            <div class="row tab-space2">
              <template v-for="(news, index) in newses">
                <div class="col-sm-6 col-12" v-if="index !== 0">
                  <TopStoryItem
                      :news="news"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
