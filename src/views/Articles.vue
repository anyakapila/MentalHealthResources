<template>
  <main>
  <Header title="Articles" subtitle="Find credible information easily." />
<div class="filter-container">
  <Filter
    title="Filter by Categories"
    :options="categoryOptions"
    v-model="selectedCategories"
    :filteredItems="filteredArticles"
  >
<div class="filtered-list">
<ul>
 <li v-for="article in filteredArticles" :key="article.id" class="card" style="margin-bottom: 1rem;">
  <a :href="article.url" target="_blank" rel="noopener noreferrer">
    <strong>{{ article.title }}</strong>
  </a>
  <p><em>{{ article.info }}</em></p>

  <button @click="toggleArticle(article.id)">Save or Remove</button>
 </li>
</ul>
<p v-if="!filteredArticles.length">No results found.</p>
</div>
</Filter>
</div>
  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Filter from '@/components/Filter.vue'
import { useArticleFilter } from '@/assets/page_articles/articlesfilter.js'
import { ref } from 'vue'
import { getAuth } from 'firebase/auth'

const {
  selectedCategories,
  categoryOptions,
  filteredArticles
} = useArticleFilter()

const message = ref('')
const error = ref('')

async function toggleArticle(articleId) {
  message.value = ''
  error.value = ''

  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      error.value = 'You must be logged in to save articles.'
      return
    }

    const idToken = await user.getIdToken()

    const response = await fetch('https://us-central1-anya-mentalhealthresources.cloudfunctions.net/app/api/saveArticle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ articleId })
    })

    if (!response.ok) {
      error.value = await response.text()
      return
    }

    message.value = await response.text()
  } catch (err) {
    error.value = err.message || 'An unknown error occured.'
  }
}
</script>

<style scoped>
button {
  margin-top: 0.5rem;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border: none;
  background-color: #2c7;
  color: white;
  border-radius: 4px;
  font-weight: 600;
}
button:hover {
  background-color: #239a00;
}
</style>