<template>
  <div class="grid gap-y-5">
    <h1 class="text-2xl font-semibold text-gray-900">Liên hệ</h1>
    <section class="flex justify-between">
      <SearchBox
          v-model="search"
          place-holder="Tìm liên hệ"
          :search-keyword="search"
          class="w-[300px]"
          @on-searching="searchMenus($event)"
      />
    </section>
    <section>
      <ag-grid-vue
          class="ag-theme-material table-clickable"
          style="height: calc(100vh - 190px); width: 100%;"
          :columnDefs="columnDefs.value"
          :rowData="contacts"
          :defaultColDef="defaultColDef"
          :cache-block-size="50"
          :enable-browser-tooltips="true"
          :row-class="'cursor-pointer'"
          :pagination="true"
          pagination-page-size="20"
          overlay-no-rows-template="No contacts found"
          animateRows="true"
          @suppressRowClickSelection="true"
          @first-data-rendered="handleFitColumnsEvent"
      >
      </ag-grid-vue>
    </section>
  </div>
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3"
import { ref, onMounted, reactive } from 'vue'
import { useNuxtApp } from '#imports'
import {CommentDto} from '~/models/menu.model'
import SearchBox from '~/components/shared/SearchBox.vue'

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-material.css"
import { CellClickedEvent } from "ag-grid-community"

const { $api, $loading } = useNuxtApp()

const defaultColDef = {
  sortable: true,
  resizable: true,
  filter: 'agTextColumnFilter',
  rowGroupPanelShow: 'always',
  pivotPanelShow: 'always',
  wrapText: true,
  autoHeaderHeight: true,
  cellClass: "cell-wrap-text",
  autoHeight: true,
}

const columnDefs = reactive({
  value: [
    { headerName: "Tên", field: "name", width: 200, minWidth: 200 },
    { headerName: "Email", field: "email", width: 315, minWidth: 315 },
    { headerName: "Nội dung", field: "content", width: 315, minWidth: 315 }
  ]
})

const search = ref<string>('')
const contacts = ref<CommentDto[]>([])
const contactsTemp = ref<CommentDto[]>([])

onMounted(() => [
  getContacts()
])

const searchMenus = ($event: any) => {
  if (!$event) {
    contacts.value = contactsTemp.value
    return
  }

  contacts.value = contactsTemp.value?.filter((item) => item.name?.toLowerCase().includes($event?.toLowerCase()) ||  item.email?.toLowerCase().includes($event?.toLowerCase()))
}

const handleFitColumnsEvent = ($event: CellClickedEvent) => {
  $event.api.sizeColumnsToFit()
}

const getContacts = async () => {
  const loader = $loading.show()

  const { data }: { data: CommentDto[] } = await $api.adminConsole.getContacts()
      .finally(() => {
        loader.hide()
      })
  contacts.value = data
  contactsTemp.value = data
}
</script>

<style scoped>
.cell-wrap-text { white-space: normal !important; }
</style>
