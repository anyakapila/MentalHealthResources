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
  selectedCategories,
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
.filter-box {
  background-color: var(--color-heading);
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin: 0.5rem 0;
  max-width: 600px;
}

.filter-title {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-background);
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.tag-checkbox {
  background-color: var(--color-background);
  border-radius: 2rem;
  padding: 0.4rem 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.tag-checkbox:hover {
  background-color: var(--color-bigheading);
  color: var(--color-background)
}

.tag-checkbox input {
  accent-color: var(--color-bigheading);
}

hr {
  margin: 1rem 0;
}

a:hover strong {
  color: var(--color-bigheading);
  transition: color 0.2s ease;
}

.clear-button {
  background-color: var(--color-text);
  color: var(color-background);
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clear-button:hover {
  background-color: var(--color-bigheading);
}
</style>