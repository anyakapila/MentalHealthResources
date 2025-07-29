<template>
    <div class="map-panel card">
        <div ref="mapEl" class="map-inner"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const mapEl = ref(null);

defineExpose({ mapEl });
</script>

<style scoped>
.map-panel {
  width: 70%;
  height: 65vh;
}

.map-inner {
  width: 100%;
  height: 100%; 
  border-radius: 5px;
}


@media (max-width: 700px) {
  .map-panel {
    width: 100%;
    height: 300px;
    order: 1;
  }
}
</style>