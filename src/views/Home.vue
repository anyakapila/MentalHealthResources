<template>
  <main>
    <h1>SupportShelf</h1>
    <p>Your all-in-one mental health resource.</p>

    <h3>What are you looking for?</h3>
    <ul>
      <li><router-link to="/why">Why?</router-link></li>
      <li><router-link to="/support">Support Providers</router-link></li>
      <li><router-link to="/hotlines">Hotlines</router-link></li>
      <li><router-link to="/articles">Articles</router-link></li>
    </ul>
  </main>
</template>

<script>
export default {
    name: 'Home'
}
</script>