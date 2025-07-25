<template>
  <main>
  <Header title="Hotlines" subtitle="Here are some hotlines you can call for immediate support." />

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
    </ul>
    </div>

  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
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
