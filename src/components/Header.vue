<template>
<div class="header">
      <img src="@/assets/newlogo.png" alt="Logo" class="logo"/>
      
      <div class="header-text">
        <h1>{{ title }}</h1>
        <h2>{{ subtitle }}</h2>
      </div>

    <!-- sign up button -->
      <router-link to = "/signup" class="signup-button">Sign Up</router-link>

    </div>
    <Nav />
</template>

<script setup>
import Nav from '@/components/Nav.vue'

defineProps({
  title: String,
  subtitle: String
})
</script>

<style scoped>

.header {
  position: relative;
  display: flex;
  flex-direction: columnn;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding: 1rem;
  font-size: clamp(0.75rem, 1.2vw, 1.2rem);
  padding-bottom: 0;
}

.header-top {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.header-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

/* supportshelf big heading */
h1 {
  text-align: left;
  font-size: 2em;
  font-weight: 700;
  margin: 0;
  color: var(--color-bigheading); 
}

/* supportshelf mini heading */
h2 {
  text-align: left;
  font-size: 1em;
  font-weight: 400;
  color: var(--color-bigheading);
  margin: 0.25em 0 0 0;
}

.logo {
  width: clamp(60px, 10vw, 120px);
}

.signup-button {
  position: absolute;
  top: 2rem;
  right: 1rem;
  background-color: var(--color-bigheading);
  color: var(--color-background);
  padding: 0.25rem 0.6rem;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.75rem;
  min-width: 60px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signup-button:hover {
  background-color: var(--color-heading);
}
@media (max-width: 600px) {
  h1 {
    font-size: 1rem;
    padding-left: 0.5rem;
    word-break: break-word;
  }

  h2 {
    font-size: 0.95rem;
    padding-left: 0.5rem;
    word-break: break-word;
  }

  .signup-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>