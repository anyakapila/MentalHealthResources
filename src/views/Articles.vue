<template>
  <main>
  <Header title="Articles" subtitle="Find credible information, easily summarized." />

<div class="filter-container">
  <Filter
    title="Filter by Categories"
    :options="categoryOptions"
    v-model="selectedCategories"
    :filteredItems="filteredArticles"
  />
</div>

  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Filter from '@/components/Filter.vue'
import { useArticleFilter } from '@/assets/page_articles/articlesfilter.js'

const {
  selectedCategories,
  categoryOptions,
  filteredArticles
} = useArticleFilter()

function updateSelected(val) {
  selectedCategories.value = val
}

</script>