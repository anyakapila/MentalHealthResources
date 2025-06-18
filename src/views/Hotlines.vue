<template>
  <main>
    <div class="header">
      <img src="@/assets/newlogo.png" alt="Logo" class="logo"/>
      <div class="header-text">
        <h1>Hotlines</h1>
        <h2>Here are some hotlines you can call for immediate support.</h2>
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
      v-for="hotline in filteredHotlines" 
      :key="hotline.id">
      
      <div v-if="hotline.url">
        <a :href="hotline.url" target="_blank">
        <strong>{{ hotline.title }}</strong></a><br />
      </div>
      <div v-else>
        <strong>{{ hotline.title }}</strong><br />
      </div>

      <em>{{ hotline.number }}</em><br />
    </li>
    </div>

  </main>
</template>

<script setup>
import { useHotlineFilter } from '@/assets/page_hotlines/hotlinesfilter.js'

const {
  selectedCategory,
  categoryNames,
  filteredHotlines,
  getCategoryName
} = useHotlineFilter()

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