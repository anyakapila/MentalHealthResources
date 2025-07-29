<template>
<div class="filter-section">
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
      Clear Filter
    </button>
  </div>

<div class="buttons">
<button class="filter-toggle" @click="filtersVisible = !filtersVisible">
    {{ filtersVisible ? 'Hide Filters' : 'Show Filters' }}
</button>
</div>
</div>

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
</template>

<script setup>
import { ref } from 'vue';

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
})

const emit = defineEmits(['update:modelValue']);

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
</style>