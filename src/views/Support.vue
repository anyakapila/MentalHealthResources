<template>
  <main>
  <Header title="Support" subtitle="Find the support provider for you." />
  <Nav />

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

    <button class="search-button" @click="searchPlaces()">Search</button>
    <button class="clear-button" @click="clearFilters">Clear Filters</button>
  
  </div>
  </div>
   
   <div>
    <div v-if="data && data.places && data.places.length">
      <div v-for="item in data.places" class="card">
        <strong>{{ item.displayName.text }}</strong><br />
        <strong>Address: </strong>{{ item.formattedAddress }}

        <!-- if there is a phone number -->
        <div v-if="item.nationalPhoneNumber">
        <strong>Phone: </strong>{{ item.nationalPhoneNumber }}<br />
        </div>

        <!-- if there is a website url -->
        <a v-if="item.websiteUri" :href="item.websiteUri" target="_blank" rel="noopener noreferrer"><strong>Website Link</strong><br /></a>

      <div v-if="item.regularOpeningHours?.weekdayDescriptions">
      <ul>
        <strong>Hours:</strong>
        <li v-for="(day, index) in item.regularOpeningHours.weekdayDescriptions" :key="index">
          {{ day }}
        </li>
      </ul>
      </div>

      </div>
    </div>

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
    };
  },
  created() {
    this.loading = true;

    getCurrentLocation(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        console.log("User Location:", this.lat, this.lng);

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
    clearFilters() {
      this.selectedFilters = [];
      this.searchPlaces();
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
              'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.regularOpeningHours.weekdayDescriptions,places.nationalPhoneNumber,places.websiteUri',
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
};

</script>

<style scoped>
</style>