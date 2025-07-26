import { ref, computed } from 'vue'

export function useFilter(items, categoryList, getItemCategoryIds) {
    const selectedCategories = ref([])

    const getCategoryName = (id) => {
        const category = categoryList.value.find(c => c.id == id)
        return category ? category.name : 'Unknown Category'
    }

    const categoryOptions = computed(() =>
        (categoryList.value || []).map(c => ({
            label: c.name,
            value: c.name
        }))
    )

    const filteredItems = computed(() => {
        if (!items.value || selectedCategories.value.length === 0) return items.value || []

        return items.value.filter(item =>
            getItemCategoryIds(item).some(catId => {
                const name = getCategoryName(catId)
                return selectedCategories.value.includes(name)
            })
        )
    })

    return {
        selectedCategories,
        categoryOptions,
        filteredItems
    }
}
