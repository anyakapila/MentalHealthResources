<template>
  <main>
  <Header title="Articles" subtitle="Find credible information easily." />
<div class="filter-container">

  <Filter
    title="Filter by Categories"
    :options="categoryOptions"
    v-model="selectedCategories"
    :filteredItems="filteredArticles"
    :showSavedToggle="true"
    v-model:savedView="showSaved"
  >

<div class="filtered-list">
<ul>
 <li v-for="article in showSaved ? savedArticlesList : filteredArticles" :key="article.id" class="card" style="margin-bottom: 1rem;">
 <div class="card-content">
   <a :href="article.url" target="_blank" rel="noopener noreferrer">
     <strong>{{ article.title }}</strong>
   </a>
   <p><em>{{ article.info }}</em></p>
 </div>
  <div v-if="user">
    <button @click="toggleArticle(article.id)" 
     class="star-button"
     :class="{ filled: isSaved(article.id) }">
      {{ isSaved(article.id) ? '★' : '☆' }}
    </button>
  </div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const user = ref(null)
const savedArticles = ref(new Set())
const showSaved = ref(false)

onMounted(() => {
  const auth = getAuth()
  const unsubscribe = onAuthStateChanged(auth, async (u) => {
    user.value = u
    if (u) {
      const idToken = await u.getIdToken()
      const res = await fetch('http://127.0.0.1:5001/anya-mentalhealthresources/us-central1/app/api/getSavedArticles', {
        headers: { Authorization: `Bearer ${idToken}` }
      })
      if (res.ok) {
        const data = await res.json()
        savedArticles.value = new Set(data.articleIds)
        console.log('Loaded saved articles:', [...savedArticles.value])
      } else {
        console.error('Failed to fetch saved articles:', await res.text())
      }
    }
  })

  onUnmounted(() => {
    unsubscribe()
  })
})

const {
  selectedCategories,
  categoryOptions,
  filteredArticles
} = useArticleFilter()

const message = ref('')
const error = ref('')

async function toggleArticle(articleId) {
  console.log("Toggling article with ID:", articleId)

  message.value = ''
  error.value = ''

  try {
    const auth = getAuth()
    const currentUser = auth.currentUser
    console.log("Current user:", currentUser)
    if (!currentUser) {
      error.value = 'You must be logged in to save articles.'
      return
    }

    let idToken
    try {
      idToken = await currentUser.getIdToken()
    } catch (tokenErr) {
      console.error("Error getting ID token:", tokenErr)
      error.value = 'Failed to get ID token.'
      return
    }

    const response = await fetch('http://127.0.0.1:5001/anya-mentalhealthresources/us-central1/app/api/saveArticle', {
    // https://us-central1-anya-mentalhealthresources.cloudfunctions.net/app/api/saveArticle
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ articleId })
    })

    const text = await response.text()
    console.log("Response text:", text)
    
    if (!response.ok) {
      error.value = text
      return
    }

    message.value = text

    const action = text.includes('added') ? 'added' : 'removed'

    if (action === 'added') {
      savedArticles.value = new Set([...savedArticles.value, articleId])
    } else {
      savedArticles.value = new Set([...savedArticles.value].filter(id => id !== articleId))
    }

  } catch (err) {
    error.value = err.message || 'An unknown error occured.'
  }
}

function isSaved(articleId) {
  return savedArticles.value.has(articleId)
}

const savedArticlesList = computed(() => 
  filteredArticles.value.filter(article => savedArticles.value.has(article.id))
)
</script>

<style scoped>
.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.card-content {
  flex-grow: 1;
}

.star-button {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  padding: 0;
}

.star-button.filled {
  color: var(--color-bigheading);
}
</style>