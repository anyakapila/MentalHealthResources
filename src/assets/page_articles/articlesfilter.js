import { ref, computed, onMounted } from 'vue'
import articleData from './articles.json'

export function useArticleFilter() {
    const articles = ref([])
    const categories = ref([])
    const selectedCategories = ref([])

    onMounted(() => {
        articles.value = articleData.articles
        categories.value = articleData.categories
    })

    // get category name by id
    const getCategoryName = (id) => {
        const category = categories.value.find(c => c.id == id)
        return category ? category.name : 'Unknown Category'
    }

    // get category names for menu
    const categoryNames = computed(() => 
        categories.value.map(c => c.name)
    )

    // filter articles by selected category
    const filteredArticles = computed(() => {
        if (selectedCategories.value.length === 0) return articles.value

        return articles.value.filter(article =>
            article.categories.some(catId => {
                const name = getCategoryName(catId)
                return selectedCategories.value.includes(name)
            })
        )
    })  

    return {
        selectedCategories,
        categoryNames,
        filteredArticles,
        getCategoryName
    }
}
