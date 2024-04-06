<script setup lang="ts">
import { computed } from "vue";
import {NewsDto} from "~/models/news.model";

const props = defineProps<{
  label?: string,
  newses: NewsDto[]
}>()
const sortedList = computed(() => (props.newses?.sort((v1, v2) => (new Date(v2.publishDate!).getTime() - new Date(v1.publishDate!).getTime())) || []))
</script>

<template>
  <div class="row">
    <div class="col-12">
      <News2Header :header="label || newses[0].categoryName"/>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-12" v-for="news in sortedList">
      <News2Item
          :news = "news"
      />
    </div>
  </div>
</template>

<style scoped>

</style>