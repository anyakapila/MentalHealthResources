<template>
  <main>
    <div class="header">
      <img src="@/assets/newlogo.png" alt="Logo" class="logo" />
      <div class="header-text">
        <h1>Support</h1>
        <h2>Find the support provider for you.</h2>
      </div>
    </div>

    <nav class="navbar navbar--with-margin">
      <ul class="nav-links">
        <router-link to="/">Home</router-link> |
        <router-link to="/why">Why?</router-link> |
        <router-link to="/support">Support</router-link> |
        <router-link to="/hotlines">Hotlines</router-link> |
        <router-link to="/articles">Articles</router-link>
      </ul>
    </nav>

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

    <button class="clear-button" @click="searchPlaces()">Search</button>
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
.filter-box {
  background-color: var(--color-heading);
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin: 0.5rem 0;
  max-width: 600px;
}

.filter-title {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-background);
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.tag-checkbox {
  background-color: var(--color-background);
  border-radius: 2rem;
  padding: 0.4rem 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.tag-checkbox:hover {
  background-color: var(--color-bigheading);
  color: var(--color-background)
}

.tag-checkbox input {
  accent-color: var(--color-bigheading);
}

a:hover strong {
  color: var(--color-bigheading);
  transition: color 0.2s ease;
}

.clear-button {
  align-items: center;
  background-color: var(--color-text);
  color: var(color-background);
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  gap: rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin: 0.5rem;
}

.clear-button:hover {
  background-color: var(--color-bigheading);
}

</style>