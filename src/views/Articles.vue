<template>
  <main>
    <div class="header">
      <img src="@/assets/newlogo.png" alt="Logo" class="logo"/>
      <div class="header-text">
        <h1>Articles</h1>
        <h2>Find credible information, easily summarized.</h2>
      </div>
    </div>

    <nav class = "navbar navbar--with-margin">
    <ul class="nav-links">
      <router-link to="/">Home</router-link> |
      <router-link to="/why">Why?</router-link> |
      <router-link to="/support">Support</router-link> |
      <router-link to="/hotlines">Hotlines</router-link> |
      <router-link to="/articles">Articles</router-link>
    </ul>
    </nav>

  <div class="filter-container">
   <label for="category-select">Filter by Category:</label>
   <select id="category-select" v-model="selectedCategory">
    <option value="">All</option>
    <option v-for="cat in categoryNames" :key="cat" :value="cat">
      {{cat}}
    </option>
   </select>
  </div>

   <div class="filtered-list">
    <li
      class="card"
      v-for="article in filteredArticles" 
      :key="article.title">
      <a :href="article.url" target="_blank">
      <strong>{{ article.title }}</strong></a><br />
      <em>{{ article.source }}</em><br />
    </li>
    </div>
  </main>
</template>

<script setup>
import { useArticleFilter } from '@/assets/page_articles/articlesfilter.js'

const {
  selectedCategory,
  categoryNames,
  filteredArticles,
  getCategoryName
} = useArticleFilter()

// comma formatting
function isLast(id, list) {
  return list.indexOf(id) === list.length - 1
}
</script>

<style scoped>
select {
  margin: 1rem 0;
}
hr {
  margin: 1rem 0;
}
a:hover strong {
  color: var(--color-bigheading);
  transition: color 0.2s ease;
}
</style>