<template>
  <main>
  <Header title="SupportShelf" subtitle="Your all-in-one mental health resource." />
    <home_intro />
  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
import home_intro from '@/assets/page_home/home_intro.vue'
</script>

<script>
export default {
    name: 'Home'
}
</script>

