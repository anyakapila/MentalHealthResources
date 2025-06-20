import { ref, computed, onMounted } from 'vue'
import hotlineData from './hotlines.json'

export function useHotlineFilter() {
    const hotlines = ref([])
    const categories = ref([])
    const selectedCategories = ref([])

    onMounted(() => {
        hotlines.value = hotlineData.hotlines
        categories.value = hotlineData.categories
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

    // filter hotlines by selected category
    const filteredHotlines = computed(() => {
        if (selectedCategories.value.length === 0) return hotlines.value

        return hotlines.value.filter(hotline =>
            hotline.categories.some(catId => {
                const name = getCategoryName(catId)
                return selectedCategories.value.includes(name)
            })
        )
    })  

    return {
        selectedCategories,
        categoryNames,
        filteredHotlines,
        getCategoryName
    }
}
