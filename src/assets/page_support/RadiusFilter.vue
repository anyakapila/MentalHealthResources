<template>
    <div class="filter-box">
     <h3 class="filter-title">Choose Search Radius</h3>

    <div class="radius-input-group">
     <input
      id="searchRadius"
      type="number"
      min="1"
      :value="inputValue"
      @input="handleInput($event.target.value)"
      class="radius-input"
      placeholder="Enter distance"
     />
     <span class="unit-label">{{ unit }}</span>
    </div>
    <div>
     <button class="distance" @click="emit('toggleUnit')">
        Show In {{ unit === 'meters' ? 'Miles' : 'Meters' }}
     </button>
    </div>
    
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: Number, // distance in meters
    unit: String // 'meters' or 'miles'
});

const emit = defineEmits(['update:modelValue', 'update:unit', 'toggleUnit']);

// input value shown in miles or meters
const inputValue = ref(1);

watch(() => props.modelValue, (newVal) => {
  inputValue.value = props.unit === 'miles'
  ? Math.round(newVal / 1609.344)
  : Math.round(newVal);
}, { immediate: true });

watch(() => props.unit, () => {
  inputValue.value = props.unit === 'miles'
  ? Math.round(props.modelValue / 1609.344)
  : Math.round(props.modelValue);
});

function handleInput(val) {
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return;

  const meters = props.unit === 'miles'
    ? num * 1609.344
    : num;

function handleToggleUnit() {
  emit('toggleUnit');
}
  emit('update:modelValue', Math.round(meters));
}

</script>

<style scoped>
.radius-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radius-input {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.6rem;
  width: 100%;
  max-width: 200px;
  font-size: 1rem;
  border: 1px solid var(--color-heading);
  border-radius: 5px;
  background-color: var(--color-background);
  color: var(--color-text);
  box-sizing: border-box;
}

.unit-label {
  font-size: 1rem;
  color: var(--color-background);
  font-weight: 500;
}
</style>