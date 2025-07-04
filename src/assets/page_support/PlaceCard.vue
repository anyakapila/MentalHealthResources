<template>
    <div 
     class="card"
     :class="{ highlighted: isSelected }"
     @click="$emit('click')"
    >

        <!-- display the name -->
        <strong>{{ item.displayName.text }}</strong><br />

        <!-- display the address -->
        <strong>Address: </strong>{{ item.formattedAddress }}

        <!-- if there is a phone number, display phone number -->
        <div v-if="item.nationalPhoneNumber">
            <strong>Phone: </strong>{{ item.nationalPhoneNumber }}<br />
        </div>

        <!-- if there is a website url, display the url -->
        <a v-if="item.websiteUri" :href="item.websiteUri" target="_blank" rel="noopener noreferrer">
            <strong>Website Link</strong><br />
        </a>

        <!-- if there are hours, display hours in a toggle -->
        
        <div v-if="item.regularOpeningHours?.weekdayDescriptions">
        
        <button @click.stop="$emit('toggle-hours')" class="toggle-hours-btn">
            {{ isExpanded ? 'Hide Hours' : 'Show Hours' }}
        </button>

            <div v-if="isExpanded">
             <ul>
                <strong>Hours:</strong>
                <li v-for="(day, dIndex) in item.regularOpeningHours.weekdayDescriptions" :key="dIndex">
                 {{ day }}
                </li>
             </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
    
defineProps({
    item: Object,
    index: Number,
    isExpanded: Boolean,
    isSelected: Boolean,
});

defineEmits(['click', 'toggle-hours']);

</script>

<style scoped>

.toggle-hours-btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.3s ease;
    background-color: var(--color-text);
    color: var(--color-background);
    margin: 1rem;
}

.toggle-hours-btn:hover {
    background-color: var(--color-bigheading);
}

</style>