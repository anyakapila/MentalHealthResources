<template>
  <main>
  <Header title="Support" subtitle="Find the support provider for you." />
  <Nav />

  <!-- filter box -->
  <div class= "filter-container">
    <div class="filter-box">
    <h3 class="filter-title">Filter by Need</h3>
    <div class="category-tags">
    <label class="tag-checkbox">
      <input type="checkbox" value="therapist" v-model="selectedFilters" />
        Therapist
    </label>
    <label class="tag-checkbox">
      <input type="checkbox" value="psychologist" v-model="selectedFilters" />
        Psychologist
    </label>
    <label class="tag-checkbox">
      <input type="checkbox" value="counselor" v-model="selectedFilters" />
        Counselor
    </label>
    </div>
    
    <button class="clear-button" @click="clearFilters">Clear Filters</button>
  
  </div>
  </div>
  
  <!--  card list -->

  <div style="display: flex; gap: 1rem;">
   <div style="width: 60%; overflow-y: auto; max-height: 500px;" ref="listContainer">

    <!-- looping through each place -->
    <div v-if="data && data.places && data.places.length">

      <div v-for="(item, index) in data.places" 
      :key="index" 
      class="card" 
      :ref="'placeCard-' + index"
      :class="{ highlighted: selectedPlaceId === index }">
        
        <!-- displaying info -->
        <strong>{{ item.displayName.text }}</strong><br />

        <strong>Address: </strong>{{ item.formattedAddress }}

        <!-- if there is a phone number -->
        <div v-if="item.nationalPhoneNumber">
        <strong>Phone: </strong>{{ item.nationalPhoneNumber }}<br />
        </div>

        <!-- if there is a website url -->
        <a v-if="item.websiteUri" :href="item.websiteUri" target="_blank" rel="noopener noreferrer"><strong>Website Link</strong><br /></a>

        <!-- showing hours -->
        <button @click="toggleHours(index)" class="toggle-hours-btn">
          {{ expandedCards.has(index) ? 'Hide hours' : 'Show hours' }}
        </button>
        <div v-if="expandedCards.has(index) && item.regularOpeningHours?.weekdayDescriptions">
          <ul>
            <strong>Hours:</strong>
            <li v-for="(day, dIndex) in item.regularOpeningHours.weekdayDescriptions" :key="dIndex">
              {{ day }}
            </li>
          </ul>
        </div>
        <!-- end of loop -->
      </div>
      </div>
    <!-- handling other cases -->   
    <div v-else-if="loading">
      <p>Loading data...</p>
    </div>
    <div v-else-if="error">
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <p>No results found.</p>
    </div>
  </div>
  <div id="map" style="width: 100%; height: 400px; margin-top: 1rem;"></div>
  </div>

  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Nav from '@/components/Nav.vue'
</script>

<script>
import { getCurrentLocation } from '@/assets/page_support/location.js'

export default {
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
    };
  },

  created() {
    this.loading = true;

    getCurrentLocation(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        console.log("User Location:", this.lat, this.lng);

        this.initMap(); // initialize map
        this.searchPlaces() // run initial search in case
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
      this.map = new google.maps.Map(document.getElementById('map'), {
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

    clearMarkers() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    },

    clearFilters() {
      this.selectedFilters = [];
      this.searchPlaces();
      },

    toggleHours(index) {
    if (this.expandedCards.has(index)) {
      this.expandedCards.delete(index);
    } else {
      this.expandedCards.add(index);
    }
    // Force reactivity since Set isn't reactive by default
    this.expandedCards = new Set(this.expandedCards);
    },

    toggleFilter(filter) {
      const index = this.selectedFilters.indexOf(filter);
      if (index > -1) {
        this.selectedFilters.splice(index, 1); // deselect
      } else {
        this.selectedFilters.push(filter); // select
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
                  radius: 500.0,
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
                const listContainer = this.$refs.listContainer;
                const cardEl = this.$refs['placeCard-' + index];

                if (listContainer && cardEl && cardEl[0]) {
                  const containerTop = listContainer.getBoundingClientRect().top;
                  const cardTop = cardEl[0].getBoundingClientRect().top;

                  // Calculate offset of card relative to container's scrollTop
                  const scrollOffset = cardTop - containerTop + listContainer.scrollTop;

                  // Scroll the container smoothly to that offset
                  listContainer.scrollTo({ top: scrollOffset, behavior: 'smooth' });
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
</style>