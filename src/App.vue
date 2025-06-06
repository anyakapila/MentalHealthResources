<script setup>
</script>

<template>
  <main>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/hotlines">Hotlines</router-link>
    </nav>
    <router-view />
  </main> 
</template>

<style scoped>
  main {
    line-height: 2;
    text-align: center;
    margin: 0;
    padding-top: 40vh;
  }

</style>
