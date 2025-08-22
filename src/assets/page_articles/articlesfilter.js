import { ref, onMounted } from 'vue'
import { useFilter } from '@/composables/useFilter.js'
import { collection, getDocs } from 'firebase/firestore'
import { database } from '@/firebase.js'

export function useArticleFilter() {
    const articles = ref([])
    const categories = ref([])
    const loading = ref(true)

    const {
        selectedCategories,
        categoryOptions,
        filteredItems: filteredArticles
    } = useFilter(
        articles,
        categories,
        item => item.categories
    )

    onMounted(async () => {
        try {
            const articlesSnap = await getDocs(collection(database, 'articles'))
            const categoriesSnap = await getDocs(collection(database, 'categories'))

            articles.value = articlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            categories.value = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } catch (error) {
            console.error("Error fetching articles or categories:", error)
        } finally {
            loading.value = false
        }
    })

    return {
        selectedCategories,
        categoryOptions,
        filteredArticles,
        loading
    }
}