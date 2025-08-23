import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'

// Import your pages
import Home from '../views/Home.vue';
import Why from '../views/Why.vue';
import Support from '../views/Support.vue';
import Hotlines from '../views/Hotlines.vue';
import Articles from '../views/Articles.vue';
import SignUp from '../views/SignUp.vue';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/why', component: Why },
  { path: '/support', component: Support },
  { path: '/hotlines', component: Hotlines },
  { path: '/articles', component: Articles },
  { path: '/signup', component: SignUp },
  { path: '/login', component: Login },
  { path: '/admin', component: Admin, meta: { requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// route guard
router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser

  if (to.meta.requiresAdmin) {
    if (!user) {
      // not logged in
      return next('/login');
    }

    // fetch claims
    const token = await user.getIdTokenResult(true)
    if (token.claims.admin) {
      next();
    } else {
      next('/'); // user is not admin
    }
  }

    return next();
});

export default router;