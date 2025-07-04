<template>
    <div class="list-panel" ref="listContainer">
        <div v-if="places?.length">

         <!-- looping through the places -->
         <PlaceCard
          v-for="(item, index) in places"
          :key="index"
          :item="item"
          :index="index"
          :isExpanded="expandedCards.has(index)"
          :isSelected="selectedPlaceId === index"
          @click="() => $emit('card-click', index)"
          @toggle-hours="() => $emit('toggle-hours', index)"
          :ref="'placeCard-' + index"
         />
        </div>

        <p v-else-if="loading">Loading data...</p>
        <p v-else-if="error">{{ error }}</p>
        <p v-else>No results found.</p>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import PlaceCard from './PlaceCard.vue';

const listContainer = ref(null);

defineProps({
    places: Array,
    loading: Boolean,
    error: String,
    expandedCards: Object,
    selectedPlaceId: Number,
})

defineEmits(['card-click', 'toggle-hours']);

function scrollToCard(index) {
    const cardEls = listContainer.value.querySelectorAll('.card');
    const cardEl = cardEls[index];
    if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

defineExpose({ scrollToCard });
</script>

<style scoped>

.list-panel {
  width: 30%;
  height: 500px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.list-panel::-webkit-scrollbar {
  display: none;
}

</style>