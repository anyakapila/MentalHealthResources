<script setup>
</script>

<template>
  <main>
    <router-view />
  </main> 
</template>

<script> 
import SignUp from '@/assets/user_accounts/SignUp.vue'

export default {
  components: {
    SignUp
  }
};
</script>

<style scoped>
  main {
    line-height: 2;
    text-align: center;
    margin: 1;
    padding: 1;
  }

</style>
