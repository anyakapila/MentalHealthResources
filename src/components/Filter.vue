<template>
<div class="filter-section">
 <div class="filter-row">

<!-- saved toggle box, only show in articles.vue -->
<div v-if="user && showSavedToggle">
 <div class="filter-box" v-show="filtersVisible">
  <h3 class="filter-title">Show Saved Articles</h3>
    <div class="saved-toggle-box">
      <button
       :class="{ active: savedView }"
       @click="emit('update:savedView', true)"
      >
      ★ Saved Articles
      </button>
      <h3 class="filter-title">Show All Articles</h3>
      <button
       :class="{ active: !savedView }"
       @click="emit('update:savedView', false)"
      >
        All Articles
      </button>
    </div>
  </div>
</div>

<!-- category filter box -->
 <div class="filter-box" v-show="filtersVisible">
    <h3 class="filter-title">{{ title }}</h3>

    <div class="category-tags">
    <label
      v-for="option in options"
      :key="option.value"
      class="tag-checkbox"
    >
      <input
        type="checkbox"
        :value="option.value"
        :checked="modelValue.includes(option.value)"
        @change="handleToggle(option.value)"
      />
      <span>{{ option.label }}</span>
    </label>
    </div>

    <button class="clear-button" @click="clearFilters">
      Clear Filters
    </button>
  </div>
</div>

<div class="buttons">
<button class="filter-toggle" @click="filtersVisible = !filtersVisible">
    {{ filtersVisible ? 'Hide Filters' : 'Show Filters' }}
</button>
</div>
</div>

<!-- optional slot for custom list rendering -->
<slot>
<!-- fallback rendering for non-custom -->
<div class="filtered-list" v-if="filteredItems.length">
   <ul>
    <li v-for="item in filteredItems" :key="item.title" class="card">
      <a :href="item.url" target="_blank">
      <strong>{{ item.title }}</strong></a><br />
      <em>{{ item.info }}</em><br />
    </li>
    </ul>
   </div>
   <p v-else>No results found.</p>
</slot>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const user = ref(null)

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (u) => {
    user.value = u
  })
})

const props = defineProps({
    title: {
        type: String,
        default: 'Filter by Categories'
    },
    options: {
        type: Array,
        required: true
    },
    modelValue: {
        type: Array,
        required: true,
        default: () => []
    },
    filteredItems: Array,
    // optional toggle for articles
    showSavedToggle: {
      type: Boolean,
      default: false
    },
    savedView: {
      type: Boolean,
      default: false  
    } 
})

const emit = defineEmits(['update:modelValue', 'update:savedView'])

const filtersVisible = ref(true); 

function handleToggle(value) {
    const updated = [...props.modelValue]
    const index = updated.indexOf(value)

    if (index > -1) {
        updated.splice(index, 1) // remove
    }
    else {
        updated.push(value) // add
    }

    emit('update:modelValue', updated)
}

function clearFilters() {
    emit('update:modelValue', [])
}
</script>

<style scoped>

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-row {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: stretch;
}

.filter-toggle {
  margin-top: 1rem;
  margin-bottom: 0;
  padding: 0.4rem 1rem;
  background-color: var(--color-text);
  color: var(--color-background);
  border: none;
  border-radius: 5px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.filter-toggle:hover {
  background-color: var(--color-bigheading);
}

.saved-toggle-box {
  margin-top: 1rem;
  height: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  background-color: var(--color-heading);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.saved-toggle-box button {
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: var(--color-text);
  color: var(--color-background);
  cursor: pointer;
  margin-bottom: 1rem;
}

.saved-toggle-box button.active {
  background-color: var(--color-bigheading);
  color: var(--color-background);
}
</style>