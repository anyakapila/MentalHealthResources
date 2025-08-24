<template>
  <main>
    <Header title="Admin Dashboard" subtitle="Manage your content." />
    <div class="admin-page">
        <section>
            <h2>Articles</h2>
            <button class="button" @click="seedArticles">Seed Articles</button>
            <button class="button" @click="showManageForms = !showManageForms">
                {{  showManageForms ? 'Hide Manage Article Forms' : 'Show Manage Article Forms' }}
            </button>
            <div v-if="showManageForms" class="admin-article-form">
                <!-- add -->
                 <div class="card">
                    <h4>Add Article</h4>
                    <input v-model="add.articleId" placeholder="Article ID" />

                    <input v-model="add.title" placeholder="Article Title" />
                    <input v-model="add.info" placeholder="Source" />
                    <input v-model="add.url" placeholder="URL" />
                    <input v-model="add.categories" placeholder="Categories (comma separated)" />

                    <button class="button" @click="submit('add')">Add</button>
                    <p v-if="message && lastAction === 'add'" :class="{ success: success, error: !success }">{{ message }}</p>
                 </div>

                <!-- update -->
                <div class="card">
                    <h4>Update Article</h4>
                    <input v-model="update.articleId" placeholder="Article ID" />

                    <input v-model="update.title" placeholder="Article Title" />
                    <input v-model="update.info" placeholder="Source" />
                    <input v-model="update.url" placeholder="URL" />
                    <input v-model="update.categories" placeholder="Categories (comma separated)" />

                    <button class="button" @click="submit('update')">Update</button>
                    <p v-if="message && lastAction === 'update'" :class="{ success: success, error: !success }">{{ message }}</p>
                </div>
                <!-- delete -->
                <div class="card">
                    <h4>Delete Article</h4>
                    <input v-model="remove.articleId" placeholder="Article ID" />

                    <button class="button" @click="submit('delete')">Delete</button>
                    <p v-if="message && lastAction === 'delete'" :class="{ success: success, error: !success }">{{ message }}</p>
                </div>
            </div>
        </section>

        <section>
            <h2>Users</h2>
            <div class="card">
            <form @submit.prevent="makeAdmin">
                <input 
                 type="text" 
                 v-model="uid" 
                 placeholder="Enter user ID" 
                 required
                />
               <br />
               <button class="button" type="submit">Make Admin</button>
            </form>
            </div>
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
const showManageForms = ref(false); //toggle for forms

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

const add = ref({
    articleId: '',
    title: '',
    info: '',
    url: '',
    categories: ''
})

const update = ref({
    articleId: '',
    title: '',
    info: '',
    url: '',
    categories: ''
})

const remove = ref({
    articleId: ''
})

const message = ref('')
const success = ref(false)
const lastAction = ref('') // track which cards action was last performed

async function submit(action) {
    lastAction.value = action;
    let payload = { action };

    if (action === 'add'){
        if (!add.value.articleId || !add.value.info) {
            message.value = 'Article ID and Info are required for Add';
            success.value = false;
            return;
        }
        payload.articleId = add.value.articleId;
        payload.article = {
            id: add.value.articleId,
            title: add.value.title,
            info: add.value.info,
            url: add.value.url,
            categories: add.value.categories
                ? add.value.categories.split(',').map(c => c.trim())
                : [],
        };
    } else if (action === 'update') {
        if (!update.value.articleId) {
            message.value = 'Article ID is required for Update';
            success.value = false;
            return;
        }
        payload.articleId = update.value.articleId;
        payload.article = {
            id: update.value.articleId,
            title: update.value.title,
            info: update.value.info,
            url: update.value.url,
            categories: update.value.categories
                ? update.value.categories.split(',').map(c => c.trim())
                : [],
        };
    } else if (action === 'delete') {
        if (!remove.value.articleId) {
            message.value = 'Article ID is required for Delete';
            success.value = false;
            return;
        }
        payload.articleId = remove.value.articleId;
    }

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(
            'http://127.0.0.1:5001/anya-mentalhealthresources/us-central1/manageArticles',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            }
        );

        const text = await res.text();
        if (!res.ok) {
            message.value = text;
            success.value = false;
        } else {
            message.value = text;
            success.value = true;

            // clear fields after success
            if (action === 'add') Object.assign(add.value, { articleId: '', title: '', info: '', url: '', categories: ''});
            if (action === 'update') Object.assign(update.value, { articleId: '', title: '', info: '', url: '', categories: ''});
            if (action === 'delete') remove.value.articleId = '';
        }
    } catch (error) {
        console.error(error);
        message.value = error.message;
        success.value = false;
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

.button {
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.3s ease;
    background-color: #fff1be;
    color: #0A1C30;
    margin-right: 1rem;
    margin-bottom: 1rem;
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

h4 {
    color: var(--color-heading);
    font-weight: 700;
    margin-bottom: 1rem;
}
</style>