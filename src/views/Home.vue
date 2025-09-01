<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { BIRTHDAY_TARGET, BIRTHDAY_NAME, LOVE_NOTE, OWNER_NAME } from '../birthday'

const now = ref(new Date())
let timer: number | undefined
function tick(){ now.value = new Date() }
onMounted(()=>{ timer = window.setInterval(tick,1000) })
onUnmounted(()=>{ if(timer) clearInterval(timer) })

function remaining(t: Date){
  const diff = +BIRTHDAY_TARGET - +t
  const clamp = (n:number)=> Math.max(0,n)
  const d = clamp(Math.floor(diff / (1000*60*60*24)))
  const h = clamp(Math.floor((diff / (1000*60*60)) % 24))
  const m = clamp(Math.floor((diff / (1000*60)) % 60))
  const s = clamp(Math.floor((diff / 1000) % 60))
  return { d,h,m,s }
}
const r = computed(()=> remaining(now.value))

function confettiBurst(){
  const emojis = ['🎉','✨','💖','🎈','🎂','🌸','⭐']
  for(let i=0;i<80;i++){
    const span = document.createElement('span')
    span.textContent = emojis[Math.floor(Math.random()*emojis.length)]
    span.style.position='fixed'
    span.style.left = Math.random()*100+'vw'
    span.style.top = '-10vh'
    span.style.fontSize = (Math.random()*24+12)+'px'
    span.style.transition = 'transform 1.2s ease, opacity 1.2s ease'
    span.style.zIndex = '9999'
    document.body.appendChild(span)
    requestAnimationFrame(()=>{
      span.style.transform = `translateY(${110+Math.random()*30}vh) rotate(${Math.random()*720-360}deg)`
      span.style.opacity='0'
    })
    setTimeout(()=> span.remove(), 1400)
  }
}
</script>

<template>
  <!-- Hero -->
  <section class="hero">
    <div class="card" style="max-width:820px">
      <h1 style="font-size:2.6rem;margin:8px 0">
        Happy Birthday, <span style="background:linear-gradient(90deg,#ff72c6,#7aa7ff);-webkit-background-clip:text;color:transparent">{{ BIRTHDAY_NAME }}</span>! ✨
      </h1>
      <p class="caption">A tiny birthday site made with love by {{ OWNER_NAME }}.</p>

      <div class="countdown" aria-live="polite">
        {{ r.d }}d : {{ r.h }}h : {{ r.m }}m : {{ r.s }}s
      </div>

      <div class="grid g2" style="margin-top:18px">
        <button class="btn" @click="confettiBurst">Celebrate 🎉</button>
        <a class="btn" href="#/memories" style="text-align:center;display:inline-block">See Memories 📸</a>
      </div>

      <p style="white-space:pre-line;margin-top:16px" class="caption">{{ LOVE_NOTE }}</p>
    </div>
  </section>

  <!-- Why You’re Amazing -->
  <section class="grid g3" style="margin-top:24px">
    <div class="card" style="grid-column:1/-1">
      <h2 style="margin:0">Why You’re Amazing 💫</h2>
      <p class="caption">Three tiny reasons (out of a million, hehe).</p>
    </div>
    <div class="card">
      <h3 style="margin:.2rem 0">1) Your Support</h3>
      <p class="caption">The way you supports me and motivates me in every aspect of life.🫂</p>
    </div>
    <div class="card">
      <h3 style="margin:.2rem 0">2) Your Care</h3>
      <p class="caption">You notice the small things and that genuine care for me I Love the most (Cutie💓).</p>
    </div>
    <div class="card">
      <h3 style="margin:.2rem 0">3) Your Sincerity</h3>
      <p class="caption">Ahh I cannot explain this thing, this is the most beautiful🥹🫂💓.</p>
    </div>
  </section>

  <!-- A Little Letter -->
  <!-- A Little Letter -->
  <section class="card" style="margin-top:24px">
    <h2 style="margin:0 0 6px">A Little Letter 💌</h2>
    <p class="caption" style="white-space:pre-wrap; line-height:1.75">
      Dear {{ BIRTHDAY_NAME }},

      I don’t even know where to begin. Maybe with **20 February 2023**, that first day at uni, when you walked in and suddenly the lecture hall felt like it had its own spotlight. I told myself I was focused on equations, but really I was calculating the odds of seeing you again in the hallway. And somehow, my “luck” always worked out.
      Then came **9, 10, 11 October**—three days that rewired my heart completely. That little *Truth & Dare* changed everything. Without it, maybe none of this would have happened, but because of it, I got to tell you the one and last  confessions of my life that made me laugh, blush, and think, “oh no… I’m done for.” Those nights turned into my favorite bookmark in the story of us.

      Since then, it’s been like an endless graph 📈—feelings always rising, never dipping, infinity times infinity ♾️ × ♾️. From friend → bestie → tutor → my everything, you somehow upgraded roles in my life faster than any software update. And unlike Windows updates, I never want to hit “skip.” 💓

      I still laugh when I think of the tiny details: me nervously asking you for notes while sitting on a jaay-e-namaz 🙈, then sprinting to the washroom after your message because my heart was about to explode 🤣. The Cafe breaks that tasted better because you were there staring you always everywhere, the random stares I tried to hide (not very successfully), and the inside jokes that turned ordinary days into highlights.

      You’ve been my everything the person I fell for from the very start.

      So here’s to you, {{ BIRTHDAY_NAME }}—the girl who made February brighter, October unforgettable, and every day since then feel lighter. May this year bring you silly giggles, brave dreams, and the softest mornings. And may you always feel loved—loudly, gently, truly—every single day.

      — {{ OWNER_NAME }}, your tech guy, your partner-in-crime, and your forever fan ♾️
    </p>
  </section>

  <!-- Call-to-action -->
  <section class="grid g2" style="margin-top:24px">
    <a href="#/game" class="card" style="text-align:center; display:block">
      <h3 style="margin:.2rem 0">Play Balloon Pop 🎈</h3>
      <p class="caption">Pop them all to unlock a surprise message.</p>
    </a>
    <a href="#/memories" class="card" style="text-align:center; display:block">
      <h3 style="margin:.2rem 0">Browse Memories 📸</h3>
      <p class="caption">Photos + long stories about our favorite moments.</p>
    </a>
  </section>
</template>
