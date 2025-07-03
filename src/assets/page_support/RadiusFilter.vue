<template>
    <div class="filter-box">
     <h3 class="filter-title">Choose Search Radius</h3>

     <label class="distance-label" for ="searchRadius">Choose a Distance: </label>
     <select id="searchRadius" :value="modelValue" @change="e => emit('update:modelValue', +e.target.value)">
      <option
        v-for="distance in distances"
        :key="distance.value"
        :value="distance.value"
      >
        {{ distance.label }}
      </option>
     </select>

    <div>
     <button class="distance" @click="emit('toggleUnit')">
        In {{ unit === 'meters' ? 'Feet' : 'Meters' }}
     </button>
    </div>
    
    </div>
</template>

<script setup>

const props = defineProps({
    modelValue: Number, // selectedDistance
    distances: Array, // convertedDistances
    unit: String // 'meters' or 'feet'
});

const emit = defineEmits(['update:modelValue', 'toggleUnit']);

</script>