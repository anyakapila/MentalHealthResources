import { ref } from 'vue'
import hotlineData from './hotlines.json'
import { useFilter } from '@/composables/useFilter.js'

export function useHotlineFilter() {
    const hotlines = ref(hotlineData.hotlines)
    const categories = ref(hotlineData.categories)

    const {
        selectedCategories,
        categoryOptions,
        filteredItems: filteredHotlines
    } = useFilter(
        hotlines,
        categories,
        item => item.categories
    )

    return {
        selectedCategories,
        categoryOptions,
        filteredHotlines
    }
}