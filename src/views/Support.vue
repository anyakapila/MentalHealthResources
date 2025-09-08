<template>
  <main>
  <Header title="Support" subtitle="Find the support provider for you." />

  <div class="filter-container" v-show="filtersVisible">
    <!-- category filter -->
    <CategoryFilter
      title="Filter by Need"
      :options="[
        { label: 'Therapist', value: 'therapist' },
        { label: 'Psychologist', value: 'psychologist' },
        { label: 'Counselor', value: 'counselor' }
      ]"
      :modelValue="selectedFilters"
      @update:modelValue="selectedFilters = $event; debouncedSearch()"
      @clear="selectedFilters = []; debouncedSearch()"
    />

    <!-- radius filter -->
    <RadiusFilter 
      v-model="selectedDistance"
      :unit="unit"
      @toggleUnit="toggleUnit"
    />
  </div>

  <button class="filter-toggle" @click="filtersVisible = !filtersVisible">
    {{ filtersVisible ? 'Hide Filters' : 'Show Filters' }}
  </button>
  
  <!--  card list + map -->

  <div class="flex-container">
  
  <!-- list -->
  <PlaceList
   ref="placeListRef"
   v-if="data?.places"
   :places="data?.places"
   :loading="loading"
   :error="error"
   :expandedCards="expandedCards"
   :selectedPlaceId="selectedPlaceId"
   @card-click="handleCardClick"
   @toggle-hours="toggleHours"
  />
  <PlaceListSkeleton v-else />

  <!-- map -->
  <Map ref="mapRef" />  

  </div>

  </main>
</template>

<script setup>
import { ref, watch, reactive, nextTick, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import CategoryFilter from '@/assets/page_support/CategoryFilter.vue'
import RadiusFilter from '@/assets/page_support/RadiusFilter.vue'
import PlaceList from '@/assets/page_support/PlaceList.vue'
import PlaceListSkeleton from '@/assets/page_support/PlaceListSkeleton.vue'
import Map from '@/assets/page_support/Map.vue'
import { loadGoogleMaps } from '@/assets/page_support/loadingGoogleMaps.js'
import { getCurrentLocation } from '@/assets/page_support/location.js'

const selectedFilters = ref([])
const selectedDistance = ref(5 * 1609.344) // default 5 miles in meters
const unit = ref('miles') // default unit
const filtersVisible = ref(true)
const data = ref(null)
const loading = ref(false)
const error = ref(null)
const expandedCards = ref(new Set())
const selectedPlaceId = ref(null)
const lat = ref(null)
const lng = ref(null)
const map = ref(null)
const markers = ref([])
const mapRef = ref(null)
const placeListRef = ref(null)

function debounce(func, wait = 500) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  }
}

const debouncedSearch = debounce(searchPlaces, 500)

onMounted(async () => {
  try {
    // load map immediately
    await loadGoogleMaps()

      // get location async
      getCurrentLocation(
        (position) => {
        try {
          lat.value = position.coords.latitude
          lng.value = position.coords.longitude

          initMap()
          searchPlaces()
        } catch (err) {
          error.value = 'Geolocation error: ' + err.message
          console.error(err)
        }
        },
        (err) => {
          error.value = 'Geolocation error: ' + err.message
          console.error(err)
        }
      )
  } catch (err) {
    error.value = 'Failed to initialize map: ' + err.message
    console.error(err)
  }
})

async function initMap() {
try {
  if (!lat.value || !lng.value) throw new Error('No location for map init')

  const mapDiv = mapRef.value?.mapEl
  if (!mapDiv) throw new Error('Map element not ready')

  const { Map } = await google.maps.importLibrary('maps')

  map.value = new Map(mapDiv, {
    center: { lat: lat.value, lng: lng.value },
    zoom: 14,
  })

  new google.maps.Marker({
    position: { lat: lat.value, lng: lng.value },
    map: map.value,
    title: 'You are here',
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: '#4285F4',
      fillOpacity: 1,
      strokeWeight: 1,
    },
  })

  console.log('Map initialized')
} catch (err) {
  console.error('Error initializing map:', err)
  error.value = 'Error initializing map: ' + err.message
}
}

async function searchPlaces() {
  try {
    if (!lat.value || !lng.value) throw new Error('No location available')
    loading.value = true

  const keyword = selectedFilters.value.length
    ? selectedFilters.value.join(' ')
    : 'mental health'
  const radius = Math.min(Math.max(Math.round(selectedDistance.value), 1000), 50000)

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const fields = 'places.displayName,places.formattedAddress,places.regularOpeningHours.weekdayDescriptions,places.nationalPhoneNumber,places.websiteUri,places.location'
  const url = `https://places.googleapis.com/v1/places:searchText?key=${apiKey}&fields=${encodeURIComponent(fields)}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        textQuery: keyword,
        locationBias: {
          circle: {
            center: { latitude: lat.value, longitude: lng.value },
            radius: radius,
          },
        },
      }),
    })

    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const result = await response.json()
    data.value = result

    // clear old markers
    markers.value.forEach(marker => marker.setMap(null))
    markers.value = []

    if (map.value && result.places) {
      result.places.forEach((place, index) => {
        if (!place.location) return
        const marker = new google.maps.Marker({
          position: {
            lat: place.location.latitude,
            lng: place.location.longitude,
          },
          map: map.value,
          title: place.displayName?.text || 'Place',
        })

        marker.addListener('click', () => {
          selectedPlaceId.value = index
          nextTick(() => {
            placeListRef.value?.scrollToCard(index)
          })
        })
        markers.value.push(marker)
      })
    }
  } catch (error) {
    console.error('Error fetching places:', error)
    error.value = 'Error fetching places'
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  selectedFilters.value = []
  debouncedSearch()
}

function toggleUnit() {
  unit.value = unit.value === 'meters' ? 'miles' : 'meters'
}

function handleCardClick(index) {
  selectedPlaceId.value = index
  const place = data.value?.places[index]
  if (!place?.location || !map.value) return

  const latLng = {
    lat: place.location.latitude,
    lng: place.location.longitude,
  }
  map.value.panTo(latLng)
  map.value.setZoom(16)

  const marker = markers.value[index]
  if (marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE)
    setTimeout(() => marker.setAnimation(null), 700)
  }
}

function toggleHours(index) {
  const newSet = new Set(expandedCards.value)

  if (newSet.has(index)) {
    newSet.delete(index)
  } else {
    newSet.add(index)
  }
  expandedCards.value = newSet
}

watch(selectedDistance, () => {
  debouncedSearch()
})
</script>

<style scoped>

.list-container {
  max-height: 500px;
  overflow-y: auto;
  width: 60%;
}

.flex-container {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 800px) {
.flex-container {
  flex-direction: column;
}

.map-panel {
  order: 1;
  width: 100% !important;
  height: 300px;
}

.list-panel {
  order: 2;
  width: 100% !important;
  max-height: 50vh;
}
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
</style>