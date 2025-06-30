<template>
  <main>
  <Header title="Why?" subtitle="The reason behind it all." />
  <Nav />

    <li class="card">
      As a high school student who has struggled with mental health issues, I decided to conduct a survey in my community to assess the accessibility of mental health-related resources to those who need them.
      The results show that many find it hard to get help easily, so I created this website to hopefully help with that. Here are some of the survey's most significant results:
      <br>
    </li>

    <div class="image-grid">
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
    
  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Nav from '@/components/Nav.vue'
</script>