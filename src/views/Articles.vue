<template>
  <main>
    <div class="header">
      <img src="@/assets/newlogo.png" alt="Logo" class="logo"/>
      <div class="header-text">
        <h1>Articles</h1>
        <h2>Find credible information, easily summarized.</h2>
      </div>
    </div>

    <nav class = "navbar navbar--with-margin">
    <ul class="nav-links">
      <router-link to="/">Home</router-link> |
      <router-link to="/why">Why?</router-link> |
      <router-link to="/support">Support</router-link> |
      <router-link to="/hotlines">Hotlines</router-link> |
      <router-link to="/articles">Articles</router-link>
    </ul>
    </nav>

    <p>
      <a href="https://www.mentalhealth.org.uk/our-work/public-engagement/unlock-loneliness/15-things-do-if-youre-feeling-lonely" target="_blank" rel="noopener noreferrer"><strong>15 Things to Do if You're Feeling Lonely</strong> from the Mental Health Foundation UK</a><br>
      <a href="https://ijmhs.biomedcentral.com/articles/10.1186/s13033-025-00666-w" target="_blank" rel="noopener noreferrer"><strong>Article on Perceived Need for Treatment</strong> from the International Journal of Mental Health Systems</a><br>
      <a href="https://magazine.medlineplus.gov/article/taking-on-the-stigma-of-adhd/" target="_blank" rel="noopener noreferrer"><strong>Taking on the Stigma of ADHD</strong> from the National Library of Medicine</a><br>
    </p>
  </main>
</template>