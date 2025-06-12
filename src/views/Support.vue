<template>
  <main>
    <div class="header">
      <img src="@/assets/newlogo.png" alt="Logo" class="logo"/>
      <div class="header-text">
        <h1>Support</h1>
        <h2>Find the therapist, psychiatrist, or other support provider for you.</h2>
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
    <providers> 
    <strong>What are you looking for?</strong><br>
    <li>Therapists</li>
    <li>Psychiatrists</li>
    <li>Group Therapy/Support Groups</li>
    <li>Treatment Centers</li><br>
    </providers>

    <filters>
    <strong>Filters</strong><br>
    <li>In Person</li>
    <li>Online</li>
    <li>$$/Insurance</li>
    <li>Hours/Flexibility</li>
    <li>Specializations</li>
    <li>Gender</li>
    </filters>
    </p>

  </main>
</template>