<template>
  <main>
    <router-link to="/" class="back-button">← Back to Home</router-link>

    <UserForm
      title="Create Account"
      :fields="fields"
      :buttonText="'Sign Up'"
      :loadingText="'Creating...'"
      :loading="loading"
      :initialValues="{ email: '', password: '' }"
      @submit="handleSignup"
    >
      <template #messages>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </template>

      <template #footer>
       <router-link to="/login">Already have an account? Log In</router-link>
      </template>
    </UserForm>
  </main>
</template>

<script>
import UserForm from '@/components/UserForm.vue';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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
          placeholder: 'At least 6 characters',
          model: 'password',
          autocomplete: 'new-password',
          minlength: 6
        }
      ]
    };
  },
  methods: {
    async handleSignup(form) {
      this.errorMessage = '';
      this.successMessage = '';
      this.loading = true;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        console.log('User created:', userCredential.user);

        this.successMessage = 'Account created! Redirecting to Home...';
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Signup error:', error);
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
