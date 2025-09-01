<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'

type Kind = 'heart' | 'star' | 'bomb'
type Item = {
  id: number
  kind: Kind
  x: number        // 0..100 (vw of play area)
  y: number        // px from top (inside play area)
  speed: number    // px per second
  size: number     // px
  caught: boolean
}

const running = ref(false)
const over = ref(false)
const score = ref(0)
const timeLeft = ref(30)
const lives = ref(3)
const combo = ref(0)
const best = ref<number>(Number(localStorage.getItem('hb_highscore') || 0))

const items = reactive<Item[]>([])
let idSeq = 1
let raf = 0
let lastTs = 0
let spawnTimer = 0
let tickTimer = 0

const areaRef = ref<HTMLDivElement | null>(null)
const basketRef = ref<HTMLDivElement | null>(null)
const basketX = ref(50) // percentage inside area (0..100)
const areaRect = ref<DOMRect | null>(null)

function reset() {
  running.value = false
  over.value = false
  score.value = 0
  timeLeft.value = 30
  lives.value = 3
  combo.value = 0
  items.splice(0, items.length)
  idSeq = 1
  spawnTimer = 0
  tickTimer = 0
  lastTs = 0
  cancelAnimationFrame(raf)
}

function start() {
  reset()
  running.value = true
  measureArea()
  raf = requestAnimationFrame(loop)
}

function endGame() {
  running.value = false
  over.value = true
  if (score.value > best.value) {
    best.value = score.value
    localStorage.setItem('hb_highscore', String(best.value))
  }
}

function measureArea() {
  if (areaRef.value) areaRect.value = areaRef.value.getBoundingClientRect()
}

function clamp(n:number, min:number, max:number){ return Math.max(min, Math.min(max, n)) }

function onPointerMove(e: PointerEvent | MouseEvent | TouchEvent){
  if(!areaRect.value) return
  let clientX: number
  if (e instanceof TouchEvent) clientX = e.touches[0]?.clientX ?? 0
  else if ((e as PointerEvent).clientX) clientX = (e as PointerEvent).clientX
  else return
  const x = clamp((clientX - areaRect.value.left) / areaRect.value.width * 100, 0, 100)
  basketX.value = x
}

function onKey(e: KeyboardEvent){
  if(!running.value) return
  if(e.key === 'ArrowLeft') basketX.value = clamp(basketX.value - 3, 0, 100)
  if(e.key === 'ArrowRight') basketX.value = clamp(basketX.value + 3, 0, 100)
}

function spawnOne() {
  // Weighted random spawns
  const r = Math.random()
  let kind: Kind = 'heart'
  if (r > 0.88) kind = 'star'           // ~12%
  else if (r < 0.18) kind = 'bomb'      // ~18%

  const speed = 140 + Math.random()*120 + score.value * 0.35 // scale with score
  const size = kind === 'star' ? 36 : kind === 'heart' ? 34 : 30

  items.push({
    id: idSeq++,
    kind,
    x: Math.random()*90 + 5, // 5..95
    y: -size,
    speed,
    size,
    caught: false
  })
  // Soft cap list
  if (items.length > 120) items.splice(0, items.length - 120)
}

function sprite(kind: Kind){
  if (kind === 'heart') return '💖'
  if (kind === 'star')  return '⭐'
  return '💣'
}

function loop(ts: number){
  if (!running.value) return
  if (!lastTs) lastTs = ts
  const dt = (ts - lastTs) / 1000
  lastTs = ts

  spawnTimer += dt
  tickTimer += dt

  // spawn every 0.45s (faster as time passes a bit)
  const interval = Math.max(0.28, 0.45 - (30 - timeLeft.value) * 0.004)
  if (spawnTimer >= interval) {
    spawnTimer = 0
    spawnOne()
  }

  // timer every 1s
  if (tickTimer >= 1) {
    tickTimer = 0
    timeLeft.value -= 1
    if (timeLeft.value <= 0) {
      timeLeft.value = 0
      endGame()
    }
  }

  // Move items, detect catch/miss
  const ar = areaRect.value
  const br = basketRef.value?.getBoundingClientRect()
  if (ar && br) {
    // basket bounds in area coordinates
    const basketLeft = (basketX.value/100) * ar.width - 52 // half basket width
    const basketRight = basketLeft + 104
    const basketTop = ar.height - 100
    const basketBottom = basketTop + 60

    for (const it of items) {
      if (it.caught) continue
      it.y += it.speed * dt

      // Convert item x% to px
      const itemLeft = (it.x/100) * ar.width - it.size/2
      const itemRight = itemLeft + it.size
      const itemTop = it.y
      const itemBottom = it.y + it.size

      const overlap = !(itemRight < basketLeft || itemLeft > basketRight || itemBottom < basketTop || itemTop > basketBottom)
      if (overlap) {
        it.caught = true
        if (it.kind === 'heart') {
          score.value += 10
          combo.value += 1
          if (combo.value % 5 === 0) {
            // small combo reward
            score.value += 10
          }
        } else if (it.kind === 'star') {
          score.value += 25
          timeLeft.value = Math.min(60, timeLeft.value + 2)
          combo.value += 1
        } else if (it.kind === 'bomb') {
          score.value = Math.max(0, score.value - 10)
          lives.value -= 1
          combo.value = 0
          if (lives.value <= 0) {
            endGame()
          }
        }
      }

      // remove items that passed bottom
      if (it.y > ar.height + 40) {
        it.caught = true
        // missing a heart breaks combo softly
        if (it.kind === 'heart') combo.value = Math.max(0, combo.value - 1)
      }
    }
  }

  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  measureArea()
  window.addEventListener('resize', measureArea)
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', measureArea)
  window.removeEventListener('keydown', onKey)
})

const statusText = computed(() => running.value ? 'Catch the hearts, avoid bombs!' : 'Tap Start')
function share(){
  const url = location.href.split('#')[0] + '#/game'
  navigator.clipboard?.writeText(`Come play my birthday game for Amna! ${url}`).catch(()=>{})
  alert('Link copied! Share it with friends 🎉')
}
</script>

<template>
  <section class="card" style="margin-top:24px">
    <div style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap">
      <h2 style="margin:0">Catch The Hearts 💖</h2>
      <div class="caption" aria-live="polite">{{ statusText }}</div>
    </div>

    <div class="hud">
      <div class="pill">Score: <b>{{ score }}</b></div>
      <div class="pill">Time: <b>{{ timeLeft }}s</b></div>
      <div class="pill">Lives:
        <span v-for="i in 3" :key="i" :aria-label="'life '+i">{{ i <= lives ? '❤️' : '🖤' }}</span>
      </div>
      <div class="pill">Combo: <b>{{ combo }}</b></div>
      <div class="pill">Best: <b>{{ best }}</b></div>
    </div>

    <div ref="areaRef"
         class="play-area"
         @mousemove="onPointerMove"
         @touchstart.prevent="onPointerMove"
         @touchmove.prevent="onPointerMove">

      <!-- falling items -->
      <div v-for="it in items" :key="it.id"
           class="falling"
           :style="{
             left: it.x + '%',
             transform: `translate(-50%, ${it.y}px)`,
             fontSize: it.size + 'px',
             opacity: it.caught ? 0 : 1
           }">
        <span class="sprite" :data-k="it.kind">{{ it.kind === 'heart' ? '💖' : it.kind === 'star' ? '⭐' : '💣' }}</span>
      </div>

      <!-- basket -->
      <div ref="basketRef"
           class="basket"
           :style="{ left: basketX + '%' }"
           aria-label="Basket to catch hearts" />
      <!-- gradient glow -->
      <div class="vignette" aria-hidden="true"></div>
    </div>

    <div class="controls">
      <button v-if="!running && !over" class="btn" @click="start()">Start</button>
      <div v-if="over" class="endbar">
        <span class="caption">Game over! Final: <b>{{ score }}</b></span>
        <button class="btn" @click="start()">Play again</button>
        <button class="btn" @click="share()">Share 🔗</button>
      </div>
    </div>

    <p class="caption" style="margin-top:10px">
      Tip: drag on mobile, move mouse or use ← → on desktop. Stars add time, bombs hurt!
    </p>
  </section>
</template>

<style scoped>
.hud{
  display:flex; gap:10px; flex-wrap:wrap; margin:10px 0 6px;
}
.pill{
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 999px;
  padding: 8px 12px;
}
.controls{ display:flex; gap:10px; align-items:center; margin-top:10px }
.endbar{ display:flex; gap:10px; align-items:center; flex-wrap:wrap }

.play-area{
  position: relative;
  height: 60vh;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg,#0f1424,#0b0b11);
  border:1px solid rgba(255,255,255,.06);
}

.falling{
  position: absolute;
  top: 0;
  will-change: transform, opacity;
  pointer-events: none;
  user-select: none;
  text-shadow: 0 4px 16px rgba(0,0,0,.45);
}

.basket{
  position: absolute;
  bottom: 24px;
  width: 104px;
  height: 60px;
  transform: translateX(-50%);
  border-radius: 14px;
  background: linear-gradient(180deg,#ffd1ec,#ff72c6 45%, #7aa7ff 100%);
  box-shadow: 0 10px 30px rgba(0,0,0,.5), inset 0 0 0 2px rgba(255,255,255,.25);
  border: 1px solid rgba(255,255,255,.2);
}

.vignette{
  position:absolute; inset:0;
  background: radial-gradient(60% 35% at 50% 0%, rgba(255,255,255,.07), transparent 60%);
  pointer-events:none;
}
</style>
