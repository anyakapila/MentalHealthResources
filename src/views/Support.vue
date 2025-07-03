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

  <!-- radius filter --> 
    <div class="filter-box">
      <h3 class="filter-title">Choose Search Radius</h3>

      <label for="searchRadius">Choose a Distance: </label>
      <select id="searchRadius" v-model="selectedDistance">
        <option
          v-for="distance in convertedDistances"
          :key="distance.value"
          :value="distance.value"
        >
          {{ distance.label }}
        </option>
      </select>

       <!-- toggle unit button -->
    <br /><button class="distance" @click="toggleUnit">
      In {{ unit === 'meters' ? 'Feet' : 'Meters' }}
    </button>
    </div>
  </div>
  
  <!--  card list -->

  <div class="flex-container">
  <!-- list container -->

   <div class="list-panel" ref="listContainer">

    <!-- looping through each place for place cards -->
    <div v-if="data && data.places && data.places.length">

      <div v-for="(item, index) in data.places" 
      :key="index" 
      class="card" 
      :ref="'placeCard-' + index"
      :class="{ highlighted: selectedPlaceId === index }"
      @click="handleCardClick(index)">
        
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
          {{ expandedCards.has(index) ? 'Hide Hours' : 'Show Hours' }}
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
  <!-- map container -->
  <div class="map-panel card">
    <div id="map" class="map-inner"></div>
  </div>
  </div>

  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Nav from '@/components/Nav.vue'
</script>

<script>
import { getCurrentLocation } from '@/assets/page_support/location.js'
import { nextTick } from 'vue';

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
      unit: 'meters', // default unit is meters
      selectedDistance: 500, // stored in meters
      baseDistances: [500, 1000], // distances always in meters
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

    async toggleUnit() {
      this.unit = this.unit === 'meters' ? 'feet' : 'meters';

      // wait for dropdown to update before triggering anything else
      await nextTick();
    },

    getDistanceInMeters() {
      return this.selectedDistance; // always stored in meters
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
    // Force reactivity 
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
    selectedDistance() {
      this.searchPlaces();
    },
    selectedFilters: {
      handler() {
      this.searchPlaces();
    },
    deep: false,
    },
    unit() {
    this.searchPlaces(); 
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

.toggle-hours-btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.3s ease;
    background-color: var(--color-text);
    color: var(--color-background);
    margin: 1rem;
}

.toggle-hours-btn:hover {
    background-color: var(--color-bigheading);
}

.flex-container {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}


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

.map-panel {
  width: 70%;
  height: 500px;
}

.map-inner {
  width: 100%;
  height: 100%; 
  border-radius: 5px;
}
</style>