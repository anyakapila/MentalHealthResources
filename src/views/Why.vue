<template>
  <main>
  <Header title="Why?" subtitle="The reason behind it all." />

    <div class="why-content">
    <li class="card">
      As a high school student who has struggled with mental health issues, I decided to conduct a survey in my community to assess the accessibility of mental health-related resources to those who need them.
      The results show that many find it hard to get help easily, so I created this website to hopefully help with that. Here are some of the survey's most significant results:
      <br>
    </li>

    <div class="card image-grid">
      <div class="image-card">
        <img src="@/assets/page_why/why1.png" alt="Survey Result 1"/>
      </div>

      <div class="image-card">
      <img src="@/assets/page_why/why2.png" alt="Survey Result 2"/>
      </div>

      <div class="image-card">
      <img src="@/assets/page_why/why3.png" alt="Survey Result 3"/>
      </div>

      <div class="image-card">
      <img src="@/assets/page_why/why4.png" alt="Survey Result 4"/>
      </div>
    </div>
    </div>
  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
</script>

<style scoped>

.why-content {
  min-height: calc(100vh-120px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
}

.why-content .card {
  margin-top: 0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(250px, 30vw, 600px), 1fr));
  gap: 2rem;
  justify-content: center;
  align-items: stretch;
  padding: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  justify-items: center;
  box-sizing: border-box;
}

.image-card {
  text-align: center;
  width: 100%;
}

.image-card img {
  width: 100%;
  height: auto;
  margin: 0 auto;
  display: block;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

</style>