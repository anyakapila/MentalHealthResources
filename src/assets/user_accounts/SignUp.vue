<template>

<router-link to="/" class="back-button">← Back to Home</router-link>

<form @submit.prevent="handleSignup" class="signup-form">
    <h2>Create Account</h2>

    <label for="email">Email</label>
    <input 
    id="email"
    type="email"
    v-model="email" 
    placeholder="youremail@example.com"
    required
    autocomplete="email"
    />

    <label for="password">Password</label>
    <input
    id="password"
    type="password"
    v-model="password"
    placeholder="At least 6 characters"
    required
    autocomplete="new-password"
    minlength="6"
    />

<button type="submit" :disabled="loading">
    {{ loading ? "Creating..." : "Sign Up" }}
</button>

<p v-if="errorMessage" class="error-message"> {{ errorMessage }}</p>
<p v-if="successMessage" class="success-message"> {{ successMessage }}</p>
</form>


</template>

<script>
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";

export default {
    data() {
        return {
            email: '',
            password: '',
            loading: false,
            errorMessage: '',
            successMessage: ''
        };
    },
    mounted() {
        console.log("Component mounted");
    },
    methods: {
        async handleSignup() {
            this.errorMessage = '';
            this.successMessage = '';
            this.loading = true;
            console.log("Signup form submitted");
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
                console.log('User created:', userCredential.user);

                //show success message
                this.successMessage = 'Account created! Redirecting to Home...';

                //redirect home to show success after 2 secs
                setTimeout(() => {
                    this.$router.push('/');
                }, 2000);

            } catch (error) {
                this.errorMessage = error.message
                console.error('Signup error:', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>

.signup-form {
    max-width: 400px;
    margin: 2rem auto;
    margin-top: 3rem;
    padding: 2rem 2.5rem;
    background: var(--color-heading);
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.signup-form h2 {
    margin-bottom: 0.5rem;
    text-align: center;
    font-weight: 700;
    color: var(--color-background);
}

.signup-form label {
    font-weight: 600;
    color: var(--color-background);
    margin-bottom: 0.2rem;
}

.signup-form input {
    padding: 0.6rem 0.8rem;
    font-size: 1rem;
    border: 1.8px solid var(--color-background);
    border-radius: 6px;
    transition: border-color 0.3s ease;
}

.signup-form input:focus {
    outline: none;
    border-color: var(--color-bigheading);
    box-shadow: 0 0 6px var(--color-bigheading);
}

.signup-form button {
  margin-top: 1rem;
  padding: 0.75rem 0;
  background-color: var(--color-bigheading);
  border: none;
  border-radius: 8px;
  color: var(--color-background);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.signup-form button:hover:not(:disabled) {
  background-color: var(--color-text);
}

.signup-form button:disabled {
  background-color: var(-color-text);
  cursor: not-allowed;
}

.error-message {
  color: #e16e6eff;
  font-weight: 600;
  text-align: center;
  margin-top: 0.5rem;
}

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