<script setup lang="ts">
import { NewsDto } from "~/models/news.model";

const props = defineProps<{
  label?: string,
  newses: NewsDto[]
}>()
</script>

<template>
  <div>
    <div class="row">
      <div class="col-lg-12 col-md-12">
        <News3Header :header="label || newses[0].categoryName"/>
        <div class="row">
          <div class="col-xl-12 col-lg-6 col-md-6 col-sm-12" v-for="news in newses">
            <News3Item
                :news = "news"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
