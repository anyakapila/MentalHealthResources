<template>
<nav class = "navbar">
    <ul class="nav-links">
      <router-link to="/">Home</router-link> |
      <router-link to="/why">Why?</router-link> |
      <router-link to="/support">Support</router-link> |
      <router-link to="/hotlines">Hotlines</router-link> |
      <router-link to="/articles">Articles</router-link> |
      <router-link v-if="isAdmin" to="/admin">Admin</router-link>
    </ul>
    </nav>
</template>

<script setup> 
import { isAdmin } from '@/stores/auth' //reactive store
</script>

<style scoped>
.navbar {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-background);
  color: var(--color-heading);
  border-bottom: 1px solid var(--color-bigheading);
  box-sizing: border-box;
  /* Remove margin-bottom by default */
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  font-size: 1em;
  font-weight: 700;
  color: var(--color-bigheading);
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:visited {
  color: var(--color-bigheading);
}

.nav-links a:hover {
  color: var(--color-heading);
}

@media (max-width: 600px) {
  .navbar {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .nav-links {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: 100%;
  }
}
</style>