<template>
  <div class="list-panel skeleton-list" ref="listContainer">
    <div v-for="n in 5" :key="n" class="skeleton-card">
      <div class="skeleton-title"></div>
      <div class="skeleton-address"></div>
      <div class="skeleton-phone"></div>
      <div class="skeleton-website"></div>
      <div class="skeleton-hours-btn"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const listContainer = ref(null)
</script>

<style scoped>
.list-panel.skeleton-list {
  height: 65vh;
  width: 30%;
  padding-right: 0.5rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-heading) transparent;
}

.list-panel::-webkit-scrollbar {
  width: 6px;
}

.list-panel::-webkit-scrollbar-track {
  background: transparent;
}

.list-panel::-webkit-scrollbar-thumb {
  background-color: var(--color-heading);
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0;
}

.skeleton-card {
  background-color: var(--color-background);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-title {
  height: 1.2rem;
  width: 60%;
  background-color: var(--color-heading);
  border-radius: 4px;
}

.skeleton-address {
  height: 0.9rem;
  width: 80%;
  background-color: var(--color-heading);
  border-radius: 4px;
}

.skeleton-phone {
  height: 0.9rem;
  width: 50%;
  background-color: var(--color-heading);
  border-radius: 4px;
}

.skeleton-website {
  height: 0.9rem;
  width: 40%;
  background-color: var(--color-heading);
  border-radius: 4px;
}

.skeleton-hours-btn {
  height: 1.2rem;
  width: 35%;
  background-color: var(--color-heading);
  border-radius: 999px;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

@media (max-width: 700px) {
  .list-panel {
    width: 100%;
    max-height: 50vh;
    order: 2;
  }
}
</style>