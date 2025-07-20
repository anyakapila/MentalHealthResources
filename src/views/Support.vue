<template>
  <main>
  <Header title="Support" subtitle="Find the support provider for you." />
  <Nav />

  <div class="filter-container">

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
      :distances="convertedDistances"
      :unit="unit"
      @toggleUnit="toggleUnit"
    />

  </div>
  
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
import Nav from '@/components/Nav.vue'
import CategoryFilter from '@/assets/page_support/CategoryFilter.vue'
import RadiusFilter from '@/assets/page_support/RadiusFilter.vue'
import PlaceList from '@/assets/page_support/PlaceList.vue'
import PlaceCard from '@/assets/page_support/PlaceCard.vue'
</script>

<script>
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
      unit: 'meters', // default unit is meters
      selectedDistance: 500, // stored in meters
      baseDistances: [500, 1000], // distances always in meters
      mapRef: null,
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
          const feet = Math.round(meters / 0.3048);
          return {
            value: meters, // still use meters for api call
            label: `${feet} feet`,
          };
        }
      });
    },
  },

  created() {
    this.loading = true;

    getCurrentLocation(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        console.log("User Location:", this.lat, this.lng);

        this.$nextTick(() => {
          this.initMap(); // initializing map
          this.searchPlaces() // run initial search
        });
      },
      (error) => {
        this.error = 'Geolocation error: ' + error.message;
        this.loading = false;
        console.error('Geolocation error', error);
      }
    );
  },

    methods: {

    initMap() {
      const mapDiv = this.$refs.mapRef?.mapEl
      if (!mapDiv) {
        console.warn('Map element not ready yet');
        return;
      }

      this.map = new google.maps.Map(mapDiv, {
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
      this.unit = this.unit === 'meters' ? 'feet' : 'meters';

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

      const radius = this.getDistanceInMeters();
      console.log(`API call with radius: ${radius} meters`);

      try {
        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': 'AIzaSyCgqfNRutkyQfLKxOsZL_HBAsBxnHjzZ14',
              'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.regularOpeningHours.weekdayDescriptions,places.nationalPhoneNumber,places.websiteUri,places.location',
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
    selectedDistance() {
      this.searchPlaces();
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
</style>