<template>
<section class = "intro">
    <div class = "introcontent">
        <h3 class = "introtitle">You're Not Alone.</h3>
        <h4 class = "introsubtitle">We're here to help you through this journey.<br>Access our library of resources at SupportShelf.</h4>
        <div class = "buttons">
            <button class = "cta-button" @click="gotoHotlines">Hotlines for Immediate Help</button>
            <button class = "cta-button" @click="gotoSupport">Find a Support Provider</button>
        </div>
    </div>
</section>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const gotoHotlines = () => {
    router.push('/hotlines');
}

const gotoSupport = () => {
    router.push('/support');
}
</script>

<style scoped>

.intro {
    background: linear-gradient(to right , #83b0e1, #0A1C30);
    text-align: center;
    align-items: center;
    justify-content: center;
    display: flex;
    min-height: 80vh;
    width: 100%;
}

.introcontent {
    max-width: 700px;
    color: #fff1be;
}

.introtitle {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.2rem;
}

.introsubtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}

.cta-button {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.3s ease;
    background-color: #fff1be;
    color: #0A1C30;
}

.cta-button:hover {
    background-color: #ddefff;
}
</style>