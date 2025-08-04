import { ref } from 'vue'
import articleData from '/functions/articles.json'
import { useFilter } from '@/composables/useFilter.js'

export function useArticleFilter() {
    const articles = ref(articleData.articles)
    const categories = ref(articleData.categories)

    const {
        selectedCategories,
        categoryOptions,
        filteredItems: filteredArticles
    } = useFilter(
        articles,
        categories,
        item => item.categories
    )

    return {
        selectedCategories,
        categoryOptions,
        filteredArticles
    }
}