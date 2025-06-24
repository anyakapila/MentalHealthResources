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
   
   <div>
    <div v-if="data">
      <div v-for="places in data" :key="places.id"> 
        <!-- Assuming each object has a unique 'id' for the key -->
        <p>{{ places }}</p>
        <!-- Display other properties as needed -->
      </div>
    </div>
    <div v-else>
      <p>Loading data...</p>
    </div>
  </div>

  </main>
</template>

<script>
import { ref } from 'vue'

export default {
  data() {
    return {
      data: null,
      loading: false,
      error: null,
    };
  },
  async created() {
    this.loading = true;
    try {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'X-Goog-Api-Key': 'AIzaSyCgqfNRutkyQfLKxOsZL_HBAsBxnHjzZ14',
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location'
          },
        body: JSON.stringify({
          textQuery: 'mental health', 
          locationBias: {
            circle: {
              center: { latitude: 37.7749, longitude: -122.4194 },
              radius: 500.0
            }
          }
        })
      }); // API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      this.data = jsonData;
    } catch (error) {
      this.error = 'Error fetching data: ' + error.message;
    } finally {
      this.loading = false;
    }
  },
};

</script>