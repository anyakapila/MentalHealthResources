<template>
  <main>
    <div class="header">
      <img src="@/assets/newlogo.png" alt="Logo" class="logo" />
      <div class="header-text">
        <h1>Why?</h1>
        <h2>The reason behind it all.</h2>
      </div>
    </div>

    <nav class="navbar">
      <ul class="nav-links">
        <router-link to="/">Home</router-link> |
        <router-link to="/why">Why?</router-link> |
        <router-link to="/support">Support</router-link> |
        <router-link to="/hotlines">Hotlines</router-link> |
        <router-link to="/articles">Articles</router-link>
      </ul>
    </nav>

    <p>
      As a high school student who has struggled with mental health issues, I decided to conduct a survey in my community to assess the accessibility of mental health-related resources to those who need them.
      The results show that many find it hard to get help easily, so I created this website to hopefully help with that.
      <br><br>
      <strong>Here are some of the survey's most significant results:</strong><br>
    </p>

    <div class = "image-grid">
      <img src="@/assets/why1.png"/><br>
      <img src="@/assets/why2.png"/><br>
      <img src="@/assets/why3.png"/><br>
      <img src="@/assets/why4.png"/><br>
    </div>
    
  </main>
</template>