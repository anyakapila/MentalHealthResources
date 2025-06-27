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
    };
  },
  created() {
    this.loading = true;

    getCurrentLocation(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log("User Location:", lat, lng);

        (async () => {
          try {
            const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': 'AIzaSyCgqfNRutkyQfLKxOsZL_HBAsBxnHjzZ14',
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.regularOpeningHours.weekdayDescriptions,places.nationalPhoneNumber,places.websiteUri',
              },
              body: JSON.stringify({
                textQuery: 'mental health',
                locationBias: {
                  circle: {
                    center: { latitude: lat, longitude: lng },
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
          } catch (error) {
            console.error("Fetch error:", error);
            this.error = 'Error fetching data: ' + error.message;
          } finally {
            this.loading = false;
          }
        })();
      },
      (error) => {
        this.error = 'Geolocation error: ' + error.message;
        this.loading = false;
        console.error('Geolocation error', error);
      }
    );
  },
};

</script>

<style scoped>

a:hover strong {
  color: var(--color-bigheading);
  transition: color 0.2s ease;
}

</style>