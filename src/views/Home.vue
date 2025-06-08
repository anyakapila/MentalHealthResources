<template>
  <main>
    <div class="header">
      <img src="@/assets/newlogo.png" alt="Logo" class="logo"/>
      <div class="header-text">
        <h1>SupportShelf</h1>
        <h2>Your all-in-one mental health resource.</h2>
      </div>
    </div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/why">Why?</router-link> |
      <router-link to="/support">Support Providers</router-link> |
      <router-link to="/hotlines">Hotlines</router-link> |
      <router-link to="/articles">Articles</router-link>
    </nav>

    <p>
    </p>
  </main>
</template>

<script>
export default {
    name: 'Home'
}
</script>

