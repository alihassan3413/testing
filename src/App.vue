<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

onMounted(() => {
  document.title = (route.meta.title as string) || 'Happy Birthday'
})
watch(() => route.meta.title, (t) => { if (t) document.title = String(t) })
</script>

<template>
  <div class="container">
    <nav class="nav card" aria-label="Main">
      <a href="#/">Home</a>
      <a href="#/memories">Memories</a>
      <a href="#/game">Play</a>
    </nav>
    <router-view />
  </div>
  <!-- subtle sparkle overlay -->
  <svg class="sparkle" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <radialGradient id="g" r="1">
        <stop offset="0.0" stop-color="#ff9de1"/>
        <stop offset="1" stop-color="transparent"/>
      </radialGradient>
    </defs>
    <circle v-for="i in 40" :key="i"
            :cx="Math.random()*100" :cy="Math.random()*100" :r="Math.random()*1.2+0.2"
            fill="url(#g)"/>
  </svg>
</template>
