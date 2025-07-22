<template>
  <main>
  <Header title="Articles" subtitle="Find credible information, easily summarized." />
  <Nav />

<div class= "filter-container">
  <div class="filter-box">
    <h3 class="filter-title">Filter by Categories</h3>

    <div class="category-tags">
    <label
      v-for="cat in categoryNames"
      :key="cat"
      class="tag-checkbox"
    >
      <input
        type="checkbox"
        :value="cat"
        v-model="selectedCategories"
      />
      <span>{{ cat }}</span>
    </label>
    </div>

    <button class="clear-button" @click="selectedCategories= []">
      Clear Filter
    </button>
  </div>
</div>

   <div class="filtered-list">
   <ul>
    <li
      class="card"
      v-for="article in filteredArticles" 
      :key="article.title">
      <a :href="article.url" target="_blank">
      <strong>{{ article.title }}</strong></a><br />
      <em>{{ article.source }}</em><br />
    </li>
    </ul>
   </div>

  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Nav from '@/components/Nav.vue'
import { useArticleFilter } from '@/assets/page_articles/articlesfilter.js'

const {
  selectedCategories,
  categoryNames,
  filteredArticles,
  getCategoryName
} = useArticleFilter()

// comma formatting
function isLast(id, list) {
  return list.indexOf(id) === list.length - 1
}
</script>