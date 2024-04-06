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
        <div class="mb-20-r ne-isotope">
          <News1Header :header="label || newses[0].categoryName"/>
          <News1Content :newses="newses" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
