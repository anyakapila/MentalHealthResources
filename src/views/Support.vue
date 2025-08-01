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
      @update:modelValue="selectedFilters = $event"
      @clear="clearFilters"
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
   ref="placeList"
   :places="data?.places"
   :loading="loading"
   :error="error"
   :expandedCards="expandedCards"
   :selectedPlaceId="selectedPlaceId"
   @card-click="handleCardClick"
   @toggle-hours="toggleHours"
  />

  <!-- map -->
  <Map ref="mapRef" />  

  </div>

  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
import CategoryFilter from '@/assets/page_support/CategoryFilter.vue'
import RadiusFilter from '@/assets/page_support/RadiusFilter.vue'
import PlaceList from '@/assets/page_support/PlaceList.vue'
import PlaceCard from '@/assets/page_support/PlaceCard.vue'
</script>

<script>
import { loadGoogleMaps } from '@/assets/page_support/loadingGoogleMaps.js'
import { getCurrentLocation } from '@/assets/page_support/location.js'
import { nextTick } from 'vue';
import Map from '@/assets/page_support/Map.vue';

export default {
  components: { Map },
  data() {
    return {
      data: null,
      loading: false,
      error: null,
      selectedFilters: [],
      lat: null,
      lng: null,
      map: null,
      markers: [],
      expandedCards: new Set(),
      selectedPlaceId: null,
      unit: 'miles', // default unit is meters
      selectedDistance: 30 * 1609.344, // 30 miles, stored in meters      mapRef: null,
      filtersVisible: true,
    };
  },
  computed: {
    convertedDistances() {
      return this.baseDistances.map((meters) => {
        if (this.unit === 'meters') {
          return {
            value: meters,
            label: `${meters} meters`,
          };
        } else {
          const miles = Math.round(meters / 1609.344);
          return {
            value: meters, // still use meters for api call
            label: `${miles} miles`,
          };
        }
      });
    },
  },

  created() {
    this.debouncedSearch = this.debounce(this.searchPlaces, 500);
    this.loading = true;

    getCurrentLocation(
      async (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        console.log("User Location:", this.lat, this.lng);

        try {
          await loadGoogleMaps(); // wait for gmaps to be ready
          this.$nextTick(() => {
            this.initMap(); // initializing map
            this.searchPlaces() // run initial search
        });
        } catch (err) {
          console.error('Failed to load Google Maps:', err);
          this.error = 'Google Maps failed to load.';
          this.loading = false;
        }
      },
      (error) => {
        this.error = 'Geolocation error: ' + error.message;
        this.loading = false;
        console.error('Geolocation error', error);
      }
    );
  },

    methods: {
    debounce(func, wait = 500) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },
    async initMap() {
      const mapDiv = this.$refs.mapRef?.mapEl
      if (!mapDiv) {
        console.warn('Map element not ready yet');
        return;
      }

      console.log('Map ref:', this.$refs.mapRef);
      const { Map } = await google.maps.importLibrary("maps");

      this.map = new Map(mapDiv, {
        center: { lat: this.lat, lng: this.lng },
        zoom: 14,
      });

      new google.maps.Marker({
        position: { lat: this.lat, lng: this.lng },
        map: this.map,
        title: "You are here",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeWeight: 1,
        }
      });
    }, 

    async toggleUnit() {
      this.unit = this.unit === 'meters' ? 'miles' : 'meters';

      // wait for dropdown to update before triggering anything else
    },

    getDistanceInMeters() {
      return this.selectedDistance; // always stored in meters
    },

    clearMarkers() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    },

    clearFilters() {
      console.log('Clear Filters received');
      this.selectedFilters = [];
      this.searchPlaces();
      },

    toggleHours(index) {
    if (this.expandedCards.has(index)) {
      this.expandedCards.delete(index);
    } else {
      this.expandedCards.add(index);
    }
    // force reactivity 
    this.expandedCards = new Set(this.expandedCards);
    },

    handleCardClick(index) {
      this.selectedPlaceId = index;

      const place = this.data.places[index];
      if (!place || !place.location || !this.map) return;

      const latLng = {
        lat: place.location.latitude,
        lng: place.location.longitude
      };

      // Center the map on the clicked list item
      this.map.panTo(latLng);
      this.map.setZoom(16); // zoom in

      // marker bounces 
      const marker = this.markers[index];
      if (marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 700); // short bounce
      }
    },

    async searchPlaces() {
      if (!this.lat || !this.lng) {
        console.warn("No location available yet.");
        return;
      }

      this.loading = true;

      const keyword = this.selectedFilters.length
        ? this.selectedFilters.join(' ')
        : 'mental health'; // fallback

      let radius = Math.round(this.getDistanceInMeters());
      if (!radius || radius <= 0) radius = 1000; // default to 1km if invalid
      if (radius > 50000) radius = 50000;
    
      console.log(`API call with radius: ${radius} meters`);

      const apiKey = 'AIzaSyCgqfNRutkyQfLKxOsZL_HBAsBxnHjzZ14';
      const fields = 'places.displayName,places.formattedAddress,places.regularOpeningHours.weekdayDescriptions,places.nationalPhoneNumber,places.websiteUri,places.location';
      const url = `https://places.googleapis.com/v1/places:searchText?key=${apiKey}&fields=${encodeURIComponent(fields)}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              textQuery: keyword ,
              locationBias: {
                circle: {
                  center: { latitude: this.lat, longitude: this.lng },
                  radius: radius,
                },
              },
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const jsonData = await response.json();
          this.data = jsonData;
          console.log("Places API Data:", JSON.stringify(jsonData, null, 2));

          this.clearMarkers();

          if (this.map && jsonData.places) {
            jsonData.places.forEach((place, index) => {
              if (!place.location) return;

              const marker = new google.maps.Marker ({
                position: {
                  lat: place.location.latitude,
                  lng: place.location.longitude
                },
                map: this.map,
                title: place.displayName?.text || 'Place',
              });

              marker.addListener('click', () => {
               this.selectedPlaceId = index;
               this.$nextTick(() => {
                if (this.$refs.placeList && this.$refs.placeList.scrollToCard) {
                  this.$refs.placeList.scrollToCard(index);
                } else {
                  console.warn('PlaceList ref or scrollToCard method missing');
                }
              });
            });

          this.markers.push(marker);
        });
      }

          if (!jsonData.places || !jsonData.places.length) {
            console.warn("No places found in response", jsonData);
          }
          } 
          catch (error) {
            console.error("Fetch error:", error);
            this.error = 'Error fetching data: ' + error.message;
          } finally {
            this.loading = false;
          }
      },
    },

  watch: {
    selectedDistance(newVal) {
      if (!newVal || newVal <= 0 || isNaN(newVal)) return;
      this.debouncedSearch();
    },
    selectedFilters: {
      handler() {
      this.searchPlaces();
    },
    deep: false,
    }
}
};

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

@media (max-width: 700px) {
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