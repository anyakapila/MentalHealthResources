import { createRouter, createWebHistory } from 'vue-router';

// Import your pages
import Home from '../views/Home.vue';
import Why from '../views/Why.vue';
import Support from '../views/Support.vue';
import Hotlines from '../views/Hotlines.vue';
import Articles from '../views/Articles.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/why', component: Why },
  { path: '/support', component: Support },
  { path: '/hotlines', component: Hotlines },
  { path: '/articles', component: Articles },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;