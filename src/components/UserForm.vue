<template>
 <form @submit="handleSubmit" class="user-form">
 <h2>{{ title }}</h2>

 <div v-for="field in fields" :key="field.id">
    <label :for="field.id">{{ field.label }}</label>
    <input 
    :id="field.id"
    :type="field.type"
    :placeholder="field.placeholder"
    v-model="formData[field.model]"
    :autocomplete="field.autocomplete || 'off'"
    :required="field.required !== false"
    :minlength="field.minlength"
    />
 </div>

 <button type="submit" :disabled="loading">
  {{ loading ? loadingText : buttonText }}
 </button>

 <slot name="messages" />
 
 <div class="user-form-footer">
  <slot name="footer" />
 </div>

 </form>
</template>

<script> 
export default {
    props: {
        title: String,
        fields: Array,
        buttonText: String,
        loadingText: String,
        loading: Boolean,
        initialValues: Object
    },
    data() {
        return {
            formData: { ...this.initialValues }
        };
    },
    methods: {
        handleSubmit(event) {
          event.preventDefault();
          event.stopPropagation();
          console.log('handleSubmit event:', event)
          this.$emit('submit-form', this.formData);
        }
    }
};
</script>

<style scoped> 
.user-form {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem 2.5rem;
  background: var(--color-heading);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.user-form h2 {
  text-align: center;
  font-weight: 700;
  color: var(--color-background);
}

.user-form label {
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 0.2rem;
}

.user-form input {
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  border: 1.8px solid var(--color-background);
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

.user-form input:focus {
  outline: none;
  border-color: var(--color-bigheading);
  box-shadow: 0 0 6px var(--color-bigheading);
}

.user-form button {
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

.user-form button:hover:not(:disabled) {
  background-color: var(--color-text);
}

.user-form button:disabled {
  background-color: var(--color-text);
  cursor: not-allowed;
}

.user-form-footer {
    margin-top: 0.5rem;
    text-align: center;
    font-size: 0.9 rem;
    color: var(--color-background);
}

.auth-form-footer a {
    text-decoration: underline;
    cursor: pointer;
    margin: 0 0.5rem;
}

.auth-form-footer a:hover {
    color: var(--color-text);
}
</style>