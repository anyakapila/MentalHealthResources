<template>
    <div class="filter-box">
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
            {{ option.label }}
         </label>
        </div>
        <button class="clear-button" @click="emit('clear')">
            Clear Filters
        </button>
    </div>
</template> 

<script setup>
const { title, options, modelValue } = defineProps({
  title: String,
  options: Array,
  modelValue: Array
});

const emit = defineEmits(['update:modelValue', 'clear']);

function handleToggle(value) {
  const updated = [...modelValue]; // ✅ now this works
  const index = updated.indexOf(value);
  if (index > -1) {
    updated.splice(index, 1);
  } else {
    updated.push(value);
  }
  emit('update:modelValue', updated);
}
</script>