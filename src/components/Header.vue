<template>
<div class="header">
      <img src="@/assets/newlogo.png" alt="Logo" class="logo"/>
      <div class="header-text">
        <h1>{{ title }}</h1>
        <h2>{{ subtitle }}</h2>
      </div>
    </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String
})
</script>

<style scoped>

.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding: 1rem;
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
  padding-left: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-bigheading); 
}

/* supportshelf mini heading */
h2 {
  text-align: left;
  padding-left: 1rem;
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-bigheading);
  margin-bottom: 0.5rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 125px;
  width: 100%;
  height: auto;
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
}
</style>