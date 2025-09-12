<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { BIRTHDAY_TARGET, BIRTHDAY_NAME, LOVE_NOTE, OWNER_NAME } from '../birthday'
import { useRouter } from 'vue-router'

// — existing code —
const now = ref(new Date())
let timer: number | undefined
function tick() { now.value = new Date() }
onMounted(() => { timer = window.setInterval(tick, 1000) })
onUnmounted(() => { if (timer) clearInterval(timer) })

function remaining(t: Date) {
  const diff = +BIRTHDAY_TARGET - +t
  const clamp = (n: number) => Math.max(0, n)
  const d = clamp(Math.floor(diff / (1000 * 60 * 60 * 24)))
  const h = clamp(Math.floor((diff / (1000 * 60 * 60)) % 24))
  const m = clamp(Math.floor((diff / (1000 * 60)) % 60))
  const s = clamp(Math.floor((diff / 1000) % 60))
  return { d, h, m, s }
}
const r = computed(() => remaining(now.value))

// Your original confetti (kept)
function confettiBurst() {
  const emojis = ['🎉', '✨', '💖', '🎈', '🎂', '🌸', '⭐']
  for (let i = 0; i < 80; i++) {
    const span = document.createElement('span')
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    span.style.position = 'fixed'
    span.style.left = Math.random() * 100 + 'vw'
    span.style.top = '-10vh'
    span.style.fontSize = (Math.random() * 24 + 12) + 'px'
    span.style.transition = 'transform 1.2s ease, opacity 1.2s ease'
    span.style.zIndex = '9999'
    document.body.appendChild(span)
    requestAnimationFrame(() => {
      span.style.transform = `translateY(${110 + Math.random() * 30}vh) rotate(${Math.random() * 720 - 360}deg)`
      span.style.opacity = '0'
    })
    setTimeout(() => span.remove(), 1400)
  }
}

// ...your existing imports & countdown code stay the same

// keep your confettiBurst as-is

// ---------- NEW: Celebration Show ----------
const router = useRouter()
const showOverlay = ref(false)
const typeLine = ref('')
const typingDone = ref(false)
const audioEnabled = ref(true)
const showLoveCTA = ref(false)

// Optional: days together to personalize the line (set your real date)
const FIRST_MEET = new Date('2023-02-20')
const daysTogether = computed(() => {
  const diff = +now.value - +FIRST_MEET
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
})

// Replace with your gentle chime if you want, or set audioEnabled=false
const MUSIC_URL = '/assets/chime.mp3'

// 👉 TEXT LINES (no images). keep them short & sweet.
const LOVE_LINES: string[] = [
  `Your smile is my favorite place.`,
  `Every day with you feels softly lit.`,
  `You make ordinary moments sparkle.`,
  `My safe place. My chaos. My calm.`,
  `I’d choose you in every universe.`,
  `More than words, more than always.`
]

// Typewriter message — now personalized with daysTogether
const typewriterText = computed(() =>
  `To ${BIRTHDAY_NAME} — ${daysTogether.value}+ days and still counting. You are my calm, my chaos, and my forever. — ${OWNER_NAME}`
)

let audio: HTMLAudioElement | null = null
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let raf = 0

// ---- particles (emoji rain) on canvas (kept) ----
type P = { x: number, y: number, vx: number, vy: number, rot: number, emoji: string, size: number, life: number }
let particles: P[] = []

function playChime() {
  if (!audioEnabled) return
  try {
    audio = new Audio(MUSIC_URL)
    audio.volume = 0.6
    audio.play().catch(() => { })
  } catch { }
}

function makeParticles(n = 110) {
  const EMOJIS = ['💖', '✨', '🌸', '🫶', '💫', '⭐', '🥰', '🎈']
  const w = innerWidth, h = innerHeight
  particles = Array.from({ length: n }).map(() => ({
    x: Math.random() * w,
    y: -20 - Math.random() * h * 0.25,
    vx: (Math.random() - 0.5) * 0.6,
    vy: 0.6 + Math.random() * 1.2,
    rot: Math.random() * Math.PI * 2,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    size: 16 + Math.random() * 22,
    life: 1
  }))
}

function drawParticles() {
  if (!canvas || !ctx) return
  const w = canvas.width = innerWidth
  const h = canvas.height = innerHeight
  ctx.clearRect(0, 0, w, h)
  particles.forEach(p => {
    p.x += p.vx + Math.sin(p.y * 0.012) * 0.25
    p.y += p.vy
    p.rot += 0.01
    p.life -= 0.0022
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.globalAlpha = Math.max(0, p.life)
    ctx.font = `${p.size}px system-ui, Apple Color Emoji, Segoe UI Emoji`
    ctx.fillText(p.emoji, 0, 0)
    ctx.restore()
    if (p.y > h + 60 || p.life <= 0) {
      p.x = Math.random() * w; p.y = -20; p.life = 1
    }
  })
  raf = requestAnimationFrame(drawParticles)
}

async function typewriter() {
  typeLine.value = ''
  typingDone.value = false
  const text = typewriterText.value
  for (let i = 0; i < text.length; i++) {
    typeLine.value += text[i]
    await new Promise(r => setTimeout(r, 24 + Math.random() * 32))
  }
  typingDone.value = true
  // reveal CTA a moment after typing finishes
  setTimeout(() => showLoveCTA.value = true, 600)   // 👈 NEW
}

function goToLoveWall() {                           // 👈 NEW
  // close overlay first for a nice transition
  closeCelebration()
  // tiny delay then navigate
  setTimeout(() => router.push('/love-wall'), 150)
}

// ---- NEW: Falling love-lines (text chips) ----
function rainLoveLines() {
  const stage = document.getElementById('line-stage')
  if (!stage) return
  stage.innerHTML = ''
  const w = innerWidth
  LOVE_LINES.forEach((txt, i) => {
    const chip = document.createElement('div')
    chip.className = 'line-chip'
    chip.style.left = Math.max(10, Math.random() * (w - 260)) + 'px'
    chip.style.animationDelay = (0.2 * i) + 's'
    chip.innerText = txt
    chip.addEventListener('click', () => {
      chip.classList.add('pop')
      confettiBurst()
      setTimeout(() => chip.remove(), 420)
    })
    stage.appendChild(chip)
  })
  // also sprinkle duplicates slowly for fullness
  let t = 0
  const timer = setInterval(() => {
    if (!document.body.contains(stage)) return clearInterval(timer)
    const txt = LOVE_LINES[Math.floor(Math.random() * LOVE_LINES.length)]
    const chip = document.createElement('div')
    chip.className = 'line-chip faint'
    chip.style.left = Math.max(10, Math.random() * (w - 260)) + 'px'
    chip.style.animationDelay = (Math.random() * 0.6) + 's'
    chip.innerText = txt
    stage.appendChild(chip)
    setTimeout(() => chip.remove(), 8000)
    t++
    if (t > 12) clearInterval(timer)
  }, 600)
}

// ---- NEW: Word fireworks (“Happy Birthday, NAME!”) ----
function wordFireworks() {
  const container = document.getElementById('firework-stage')
  if (!container) return
  container.innerHTML = ''
  const messages = [
    `Happy Birthday, ${BIRTHDAY_NAME}!`,
    `You are so loved.`,
    `Forever & always — ${OWNER_NAME}`
  ]
  messages.forEach((msg, idx) => {
    const burst = document.createElement('div')
    burst.className = 'word-burst'
    burst.style.animationDelay = (0.7 * idx) + 's'
    msg.split('').forEach((ch, i) => {
      const span = document.createElement('span')
      span.textContent = ch
      span.style.setProperty('--i', String(i))
      burst.appendChild(span)
    })
    container.appendChild(burst)
  })
  // clean up after a while
  setTimeout(() => { container.innerHTML = '' }, 6000)
}

// ---- NEW: Sparkle cursor (auto disables on close) ----
let sparkleTimer: number | null = null
function startSparkleCursor() {
  const onMove = (e: MouseEvent) => {
    const s = document.createElement('span')
    s.className = 'spark'
    s.style.left = e.clientX + 'px'
    s.style.top = e.clientY + 'px'
    document.body.appendChild(s)
    requestAnimationFrame(() => s.classList.add('go'))
    setTimeout(() => s.remove(), 700)
  }
  window.addEventListener('mousemove', onMove)
  sparkleTimer = window.setTimeout(() => {
    window.removeEventListener('mousemove', onMove)
    sparkleTimer = null
  }, 8000)
}

function mountCanvas() {
  canvas = document.getElementById('celebration-canvas') as HTMLCanvasElement | null
  if (canvas) {
    ctx = canvas.getContext('2d')
    makeParticles(120)
    drawParticles()
  }
}

function unmountCanvas() {
  cancelAnimationFrame(raf)
  particles = []
  ctx = null
  canvas = null
  if (sparkleTimer) { clearTimeout(sparkleTimer); sparkleTimer = null }
}

async function runCelebration() {
  showOverlay.value = true
  await new Promise(r => requestAnimationFrame(() => r(null)))
  playChime()
  mountCanvas()
  typewriter()
  rainLoveLines()
  wordFireworks()
  startSparkleCursor()
  confettiBurst()
  setTimeout(() => confettiBurst(), 900) // a second burst
}

function closeCelebration() {
  showOverlay.value = false
  unmountCanvas()
  if (audio) { audio.pause(); audio = null }
}

</script>


<template>
  <!-- Hero -->
  <section class="hero">
    <div class="card" style="max-width:820px">
      <h1 style="font-size:2.6rem;margin:8px 0">
        Happy Birthday, <span
          style="background:linear-gradient(90deg,#ff72c6,#7aa7ff);-webkit-background-clip:text;color:transparent">{{
            BIRTHDAY_NAME }}</span>! ✨
      </h1>
      <p class="caption">A tiny birthday site made with love by {{ OWNER_NAME }}.</p>

      <div class="countdown" aria-live="polite">
        {{ r.d }}d : {{ r.h }}h : {{ r.m }}m : {{ r.s }}s
      </div>

      <div class="grid g2" style="margin-top:18px">
        <button class="btn" @click="runCelebration">Celebrate 🎉</button>
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

      I don’t even know where to begin. Maybe with **20 February 2023**, that first day at uni, when you walked in and
      suddenly the lecture hall felt like it had its own spotlight. I told myself I was focused on equations, but really
      I was calculating the odds of seeing you again in the hallway. And somehow, my “luck” always worked out.
      Then came **9, 10, 11 October**—three days that rewired my heart completely. That little *Truth & Dare* changed
      everything. Without it, maybe none of this would have happened, but because of it, I got to tell you the one and
      last confessions of my life that made me laugh, blush, and think, “oh no… I’m done for.” Those nights turned into
      my favorite bookmark in the story of us.

      Since then, it’s been like an endless graph 📈—feelings always rising, never dipping, infinity times infinity ♾️ ×
      ♾️. From friend → bestie → tutor → my everything, you somehow upgraded roles in my life faster than any software
      update. And unlike Windows updates, I never want to hit “skip.” 💓

      I still laugh when I think of the tiny details: me nervously asking you for notes while sitting on a jaay-e-namaz
      🙈, then sprinting to the washroom after your message because my heart was about to explode 🤣. The Cafe breaks
      that tasted better because you were there staring you always everywhere, the random stares I tried to hide (not
      very successfully), and the inside jokes that turned ordinary days into highlights.

      You’ve been my everything the person I fell for from the very start.

      So here’s to you, {{ BIRTHDAY_NAME }}—the girl who made February brighter, October unforgettable, and every day
      since then feel lighter. May this year bring you silly giggles, brave dreams, and the softest mornings. And may
      you always feel loved—loudly, gently, truly—every single day.

      — {{ OWNER_NAME }}, your tech guy, your partner-in-crime, and your forever fan ♾️
    </p>
  </section>

  <!-- Call-to-action -->
  <section class="grid g2" style="margin-top:24px">
    <a href="#/game" class="card" style="text-align:center; display:block">
      <h3 style="margin:.2rem 0">Play Game 🎈</h3>
      <p class="caption">Enjoy you my little prettiest girl.</p>
    </a>
    <a href="#/memories" class="card" style="text-align:center; display:block">
      <h3 style="margin:.2rem 0">Browse Memories 📸</h3>
      <p class="caption">Photos + long stories about our favorite moments.</p>
    </a>
  </section>

  <!-- Celebration Overlay -->
  <div v-if="showOverlay" class="celebration-overlay" role="dialog" aria-modal="true" @click.self="closeCelebration">
    <button class="overlay-close" @click="closeCelebration" aria-label="Close celebration">✖</button>

    <!-- canvas particles -->
    <canvas id="celebration-canvas" class="celebration-canvas" aria-hidden="true"></canvas>

    <!-- Typewriter message -->
    <div class="typewrap">
      <div class="typewriter">
        <span class="gradient">{{ typeLine }}</span><span v-if="!typingDone" class="caret">|</span>
      </div>

      <button v-if="showLoveCTA" class="btn lovewall-cta" @click.stop="goToLoveWall">
        Open Love Wall 💗
      </button>
    </div>



    <!-- Polaroid memories -->
    <div id="polaroid-stage" class="polaroid-stage" aria-label="Memories gallery"></div>

    <!-- Hint -->
    <div class="hint caption">Tap anywhere to close</div>
  </div>

</template>

<style scoped>
/* Overlay shell */
.celebration-overlay {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(1200px 600px at 50% -10%, rgba(255, 255, 255, 0.3), transparent 60%),
    rgba(8, 10, 26, 0.72);
  backdrop-filter: blur(2px);
  z-index: 9998;
  overflow: hidden;
  animation: fadeIn .35s ease both;
}

@keyframes fadeIn {
  from {
    opacity: 0
  }

  to {
    opacity: 1
  }
}

.overlay-close {
  position: absolute;
  top: 14px;
  right: 14px;
  border: 0;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  backdrop-filter: blur(4px);
}

.overlay-close:hover {
  background: rgba(255, 255, 255, 0.25)
}

.celebration-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Typewriter line */
.typewrap {
  position: absolute;
  left: 50%;
  top: 16%;
  transform: translateX(-50%);
  max-width: 90vw;
  width: 920px;
  padding: 8px 14px;
  text-align: center;
}

.typewriter {
  font-size: clamp(18px, 2.2vw, 28px);
  line-height: 1.5;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, .35);
}

.typewriter .gradient {
  background: linear-gradient(90deg, #ff9bd6, #a7bfff, #ffd39b);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.caret {
  display: inline-block;
  margin-left: 2px;
  animation: blink 1s steps(2, end) infinite;
}

@keyframes blink {

  0%,
  49% {
    opacity: 1
  }

  50%,
  100% {
    opacity: 0
  }
}

/* Polaroid gallery */
.polaroid-stage {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* individual cards will enable on click */
}

.polaroid {
  position: absolute;
  top: -220px;
  width: 160px;
  aspect-ratio: 3/4;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .25);
  padding: 8px;
  transform-origin: center;
  transform: translateY(0) rotate(var(--tilt, 0deg));
  animation: fall 1.2s cubic-bezier(.2, .8, .2, 1) forwards,
    sway 5.6s ease-in-out infinite .8s alternate;
  pointer-events: auto;
  cursor: zoom-in;
}

.polaroid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

@keyframes fall {
  to {
    transform: translateY(65vh) rotate(var(--tilt, 0deg));
  }
}

@keyframes sway {
  0% {
    transform: translateY(65vh) rotate(calc(var(--tilt, 0deg) - 5deg)) translateX(-6px)
  }

  100% {
    transform: translateY(65vh) rotate(calc(var(--tilt, 0deg) + 5deg)) translateX(6px)
  }
}

.polaroid.zoom {
  z-index: 2;
  transform: translate(-50%, -50%) rotate(0) scale(2);
  top: 50vh !important;
  left: 50% !important;
  animation: none;
  cursor: zoom-out;
}

/* Small hint */
.hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  opacity: .85;
  background: rgba(0, 0, 0, .25);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}

/* NEW: Love Wall CTA styling */
.lovewall-cta {
  margin-top: 16px;
  padding: 10px 16px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff72c6, #7aa7ff);
  color: #fff;
  border: 0;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .25);
  transition: transform .15s ease, opacity .3s ease;
  animation: popIn .35s ease both;
}

.lovewall-cta:hover {
  transform: translateY(-1px) scale(1.02)
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(6px) scale(.96)
  }

  to {
    opacity: 1;
    transform: none
  }
}
</style>
