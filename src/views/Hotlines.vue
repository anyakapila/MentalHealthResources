<template>
  <main>
  <Header title="Hotlines" subtitle="Here are some hotlines you can call for immediate support." />

  <div class="filter-container">
  <Filter
    title="Filter by Categories"
    :options="categoryOptions"
    v-model="selectedCategories"
    :filteredItems="filteredHotlines"
  />
  </div>

  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Filter from '@/components/Filter.vue'
import { useHotlineFilter } from '@/assets/page_hotlines/hotlinesfilter.js'

const {
  selectedCategories,
  categoryOptions,
  filteredHotlines
} = useHotlineFilter()

function updateSelected(val) {
  selectedCategories.value = val
}

</script>
