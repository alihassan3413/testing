<script setup lang="ts">
import { MEMORIES } from '../memories'
</script>

<template>
  <section class="grid g3" style="margin-top:24px">
    <div class="card" style="grid-column:1/-1">
      <h2 style="margin:0 0 6px">Memories with Amna 📸</h2>
      <p class="caption">Photos and little stories—curated with love.</p>
    </div>

    <article v-for="(m, i) in MEMORIES" :key="i" class="card" style="display:flex;flex-direction:column;gap:10px">
      <img v-if="m.img" :src="m.img" alt="" style="width:100%;height:240px;object-fit:cover;border-radius:12px"/>
      <h3 v-if="m.title" style="margin:.2rem 0 0">{{ m.title }}</h3>
      <p v-if="m.text" class="caption" style="white-space:pre-wrap; line-height:1.6">{{ m.text }}</p>
    </article>

    <div v-if="!MEMORIES.length" class="card" style="grid-column:1/-1;text-align:center">
      <p class="caption">No memories yet. Add them in <code class="kbd">src/memories.ts</code> and images in <code class="kbd">/public/memories</code>.</p>
    </div>
  </section>
</template>
