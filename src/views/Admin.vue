<template>
  <main>
    <Header title="Admin Dashboard" subtitle="Manage your content." />
    <div class="admin-page">
        <section>
            <h2>Articles</h2>
            <button class="button" @click="seedArticles">Seed Articles</button>
            <!--<button @click="manageArticles">Manage Articles</button>-->
        </section>

        <section>
            <h2>Users</h2>
            <form @submit.prevent="makeAdmin">
                <input 
                 type="text" 
                 v-model="userId" 
                 placeholder="Enter user ID" 
                 required
                />
               <br />
               <button class="button" type="submit">Make Admin</button>
            </form>
        </section>
    </div>
  </main>
</template>

<script setup> 
import Header from '@/components/Header.vue'
import { ref } from 'vue'
import { getAuth } from 'firebase/auth'

const auth = getAuth();
const uid = ref('');

async function seedArticles() {
    const token = await auth.currentUser.getIdToken()
    const res = await fetch(
        'http://127.0.0.1:5001/anya-mentalhealthresources/us-central1/seedArticles',
        {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        }
    )

    if (!res.ok) {
        alert(await res.text())
    } else {
        alert('Articles seeded successfully!')
    }
} 

async function makeAdmin() {
    const token = await auth.currentUser.getIdToken()
    const res = await fetch(
        'http://127.0.0.1:5001/anya-mentalhealthresources/us-central1/makeAdmin',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ uid: uid.value })
        }
    )

    if (!res.ok) {
        alert(await res.text())
    } else {
        alert('User promoted to admin successfully!')
        uid.value = ''
    }
}
</script>

<style scoped> 
.admin-page {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

h2 {
 color: var(--color-heading);
 font-weight: 700;
 margin-bottom: 1rem;
}

section {
  margin-top: 0;
  margin-bottom: 2rem;
  flex-direction: column;
  padding: 2rem;
  margin: 2rem;
  gap: 5rem;
}

.buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}

.button {
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.3s ease;
    background-color: #fff1be;
    color: #0A1C30;
}

.button:hover {
   background-color: var(--color-heading);
}

input {
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: var(--color-text);
  border-radius: 4px;
  margin-bottom: 1rem;
  color: var(--color-background);
}
</style>