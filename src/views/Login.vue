<template>
  <main>
    <router-link to="/" class="back-button">← Back to Home</router-link>

    <UserForm
      title="Log In"
      :fields="fields"
      :buttonText="'Log In'"
      :loadingText="'Logging in...'"
      :loading="loading"
      :initialValues="{ email: '', password: '' }"
      @submit-form="handleLogin"
    >
      <template #messages>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </template>

      <template #footer>
       <router-link to="/signup">Don't have an account? Sign Up</router-link>
      </template>
    </UserForm>
  </main>
</template>

<script>
import UserForm from '@/components/UserForm.vue';
import { auth } from '@/firebase';
import { useRoute, useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getIdTokenResult } from 'firebase/auth';

export default {
  components: { UserForm },
  data() {
    return {
      errorMessage: '',
      successMessage: '',
      loading: false,
      fields: [
        {
          id: 'email',
          label: 'Email: ',
          type: 'email',
          placeholder: 'youremail@example.com',
          model: 'email',
          autocomplete: 'email'
        },
        {
          id: 'password',
          label: 'Password: ',
          type: 'password',
          placeholder: 'Enter your password',
          model: 'password',
          autocomplete: 'current-password'
        }
      ]
    };
  },
  methods: {
    async handleLogin(form) {
      console.log("handleLogin received:", form);
      if (form instanceof SubmitEvent) {
        console.warn("Ignoring native submit event.");
        return;
      }

      console.log("Form data:", form);
      this.errorMessage = '';
      this.successMessage = '';
      this.loading = true;

      try {
        if (!form.email || !form.password) {
          this.errorMessage = 'Email and password are required.';
        }

        const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        const user = userCredential.user;
        console.log('Logged in:', user);

        // get id token result to check claims
        const tokenResult = await getIdTokenResult(user);
        let redirectPath = '/';

        if (tokenResult.claims.admin) {
          redirectPath = '/admin';
        } else if (this.$route.query.redirect) {
          redirectPath = this.$route.query.redirect;
        }

        this.successMessage = 'Login successful! Redirecting...';
        
        setTimeout(() => {
          this.$router.push(redirectPath);
        }, 1500);
      } catch (error) {
        console.error('Login error:', error);
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.back-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-text);
  color: var(--color-background);
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.2s ease;
}
.back-button:hover {
  background-color: var(--color-bigheading);
}
.error-message {
  color: var(--color-background);
  font-weight: 600;
  text-align: center;
  margin-top: 0.5rem;
}
.success-message {
  color: var(--color-background);
  font-weight: 600;
  text-align: center;
  margin-top: 1rem;
  background-color: var(--color-bigheading);
  padding: 0.75rem;
  border-radius: 6px;
}
</style>