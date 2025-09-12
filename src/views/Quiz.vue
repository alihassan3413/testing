<template>
    <section class="quiz-wrap">
        <header class="quiz-header">
            <h1 class="title">💘 Lets Take a Test</h1>
            <p class="subtitle">Tiny questions. Big feelings.</p>
        </header>

        <main class="quiz-card" v-if="!finished">
            <div class="progress">
                <div class="bar" :style="{ width: ((currentIndex + 1) / QUESTIONS.length * 100) + '%' }"></div>
            </div>

            <h2 class="question">{{ QUESTIONS[currentIndex].q }}</h2>

            <!-- Options container -->
            <div class="options" ref="optionsRef">
                <!-- For non-final questions -->
                <template v-if="!isLast()">
                    <button v-for="(opt, i) in QUESTIONS[currentIndex].options" :key="i" class="btn" @click="next()">
                        {{ opt }}
                    </button>
                </template>

                <!-- Final question: YES normal, NO evasive -->
                <template v-else>
                    <button class="btn yes-btn" @click="sayYes">Yes 💖</button>

                    <button ref="noBtnRef" class="btn no-btn" :style="{ left: noPos.left + '%', top: noPos.top + '%' }"
                        @mouseenter="onNoAttempt" @mousedown.prevent.stop="onNoAttempt"
                        @touchstart.prevent.stop="onNoAttempt" @click.prevent.stop="onNoAttempt"
                        @keydown.prevent.stop="onNoAttempt" tabindex="-1" aria-hidden="true">
                        No 🙈
                    </button>
                </template>
            </div>

            <div class="navs">
                <button class="ghost" @click="goBack">← Back</button>
                <span class="step">{{ currentIndex + 1 }} / {{ QUESTIONS.length }}</span>
            </div>
        </main>

        <!-- Success screen -->
        <div class="success" v-else>
            <div class="confetti" aria-hidden="true">🎉🎉🎉</div>
            <h2>Yaaay! You said YES! 💍</h2>
            <p>Our forever begins now. Thank you for making my heart the happiest. 🦋</p>
            <div class="success-actions">
                <button class="btn" @click="goHome">Back to Love Wall</button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Quiz data
type Q = { q: string; options: string[] }
const QUESTIONS = [
    { q: "Am I your favorite person? 😏", options: ["Definitely", "Always"] },
    { q: "Do you believe in forever love? ♾️", options: ["Yes", "Yes, with you"] },

    // ✨ New tricky-cute ones
    { q: "Will you ever be angry with me? 😇", options: ["No, never", "Never Love"] },
    { q: "Do butterflies still show up when you see me? 🦋", options: ["Every time", "Even more now"] },
    { q: "Coffee or me in the morning? ☕❤️", options: ["You (then coffee)", "You. Always you."] },
    { q: "Rainy day plans? 🌧️", options: ["Movies + cuddles", "Blanket fort + snacks"] },
    { q: "May I be your safe place? 🏡", options: ["You already are", "Forever will be"] },
    { q: "If I write you love notes, will you keep them? ✍️", options: ["In a secret box", "In my heart"] },
    { q: "If I get cheesy, will you still smile? 🧀", options: ["Cheesy is cute", "Bring it on"] },
    { q: "Do I make your heart feel cozy? 🧣", options: ["Warm and toasty", "Soft and safe"] },
    { q: "You will never get angry on me for more than one day ok? 😊", options: ["Yess", "Gently, yes"] },
    { q: "I'm the reason of your happiness ok? 🌟", options: ["Yes You Are", "I'm sad without you"] },
    { q: "Will You agree to me always’? 🔐", options: ["Always", "How I cannot be agree with you"] },
    { q: "You will give me treats after every week ok? 🍝", options: ["Yes My Love", "For You Anything"] },
    { q: "Can I be your calm after a long day? 🌤️", options: ["My favorite calm", "My soft landing"] },
    { q: "Do you love Me? 🎁", options: ["Yes", "Of course"] },

    // Final proposal (only 'No' appears here for the evasive button)
    { q: "Will you marry me? 💍", options: ["Yes 💖", "No 🙈"] },
]


const currentIndex = ref(0)
const finished = ref(false)

function isLast() {
    return currentIndex.value === QUESTIONS.length - 1
}
function next() {
    if (!isLast()) {
        currentIndex.value++
    } else {
        // should never hit here for final because we gate the buttons
        sayYes()
    }
}
function sayYes() {
    finished.value = true
    // (Optional) You could trigger confetti here if you integrate a confetti lib.
}

// Navigation helpers
function goBack() {
    if (currentIndex.value > 0) currentIndex.value--
    else router.back()
}
function goHome() {
    // Change this to your love wall route name/path
    router.push({ path: '/' })
}

// --- No-button Anti-Click System ---
const optionsRef = ref<HTMLElement | null>(null)
const noBtnRef = ref<HTMLElement | null>(null)
const noPos = ref({ left: 62, top: 52 }) // % within .options

const SAFE_DIST = 140 // px radius around pointer
const EDGE_PADDING = 8 // px padding from edges

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

function placeNoAwayFrom(x: number, y: number) {
    if (!isLast()) return
    const box = optionsRef.value?.getBoundingClientRect()
    const btn = noBtnRef.value?.getBoundingClientRect()
    if (!box || !btn) return

    const cx = box.left + (noPos.value.left / 100) * box.width
    const cy = box.top + (noPos.value.top / 100) * box.height

    // if already safe, keep
    const dist = Math.hypot(x - cx, y - cy)
    if (dist > SAFE_DIST) return

    // try a few candidate spots around a ring
    for (let i = 0; i < 10; i++) {
        const angle = Math.atan2(cy - y, cx - x) + (Math.random() - 0.5) * 1.8
        const radius = SAFE_DIST + 40 + Math.random() * 160

        let nx = cx + Math.cos(angle) * radius
        let ny = cy + Math.sin(angle) * radius

        nx = clamp(nx, box.left + EDGE_PADDING + btn.width / 2, box.right - EDGE_PADDING - btn.width / 2)
        ny = clamp(ny, box.top + EDGE_PADDING + btn.height / 2, box.bottom - EDGE_PADDING - btn.height / 2)

        noPos.value.left = ((nx - box.left) / box.width) * 100
        noPos.value.top = ((ny - box.top) / box.height) * 100

        const nd = Math.hypot(x - nx, y - ny)
        if (nd > SAFE_DIST * 0.9) return
    }

    // fallback: random teleport
    noPos.value.left = 10 + Math.random() * 80
    noPos.value.top = 10 + Math.random() * 80
}

function onMove(ev: MouseEvent | TouchEvent) {
    if (!isLast()) return
    let x: number, y: number
    if (ev instanceof TouchEvent) {
        const t = ev.touches[0] || ev.changedTouches[0]
        if (!t) return
        x = t.clientX
        y = t.clientY
    } else {
        x = ev.clientX
        y = ev.clientY
    }
    placeNoAwayFrom(x, y)
}

function onNoAttempt(ev?: Event) {
    // even if somehow focused / clicked, block and dash
    ev?.preventDefault()
    ev?.stopPropagation()
    const box = optionsRef.value?.getBoundingClientRect()
    const btn = noBtnRef.value?.getBoundingClientRect()
    if (!box || !btn) return
    noPos.value.left = 10 + Math.random() * 80
    noPos.value.top = 10 + Math.random() * 80
}

onMounted(() => {
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
})
onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('touchmove', onMove)
})
</script>

<style scoped>
/* Layout */
.quiz-wrap {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
    background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
}

/* Header */
.quiz-header {
    text-align: center;
    padding: 28px 16px 8px;
}

.title {
    font-size: clamp(28px, 4vw, 40px);
    margin: 0;
    background: linear-gradient(45deg, #e74c3c, #f39c12, #e67e22);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.subtitle {
    margin: 6px 0 0;
    color: #7f8c8d;
    font-style: italic;
}

/* Card */
.quiz-card {
    width: min(720px, 92vw);
    margin: 12px auto 40px;
    padding: 22px 18px 16px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, .12);
}

/* Progress */
.progress {
    height: 8px;
    background: #f0f1f3;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 16px;
}

.bar {
    height: 100%;
    background: linear-gradient(90deg, #ff7675, #e84393);
    width: 0%;
}

/* Question */
.question {
    text-align: center;
    font-size: clamp(18px, 3.3vw, 24px);
    margin: 12px 0 18px;
    color: #e74c3c;
    font-weight: 700;
}

/* Options */
.options {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
    min-height: 140px;
    /* room for evasive NO */
    align-items: center;
    justify-items: center;
    padding: 8px;
}

.btn {
    appearance: none;
    border: 0;
    padding: 12px 18px;
    border-radius: 999px;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    color: #fff;
    background: linear-gradient(45deg, #fd79a8, #e84393);
    box-shadow: 0 8px 18px rgba(232, 67, 147, .25);
    transition: transform .2s ease, box-shadow .2s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(232, 67, 147, .33);
}

.yes-btn {
    background: linear-gradient(45deg, #55efc4, #00b894);
    box-shadow: 0 8px 18px rgba(0, 184, 148, .25);
}

/* Evasive NO: absolute, unclickable fun */
.no-btn {
    position: absolute;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, #ff7675, #d63031);
    box-shadow: 0 8px 18px rgba(214, 48, 49, .25);
    pointer-events: auto;
    /* we still want hover to trigger then run */
}

/* Nav/footer */
.navs {
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.ghost {
    background: transparent;
    color: #7f8c8d;
    border: 1px solid #dfe6e9;
    padding: 8px 14px;
    border-radius: 10px;
    cursor: pointer;
}

.step {
    color: #95a5a6;
}

/* Success screen */
.success {
    width: min(700px, 92vw);
    margin: 40px auto;
    text-align: center;
    background: #fff;
    padding: 28px 20px 32px;
    border-radius: 16px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, .12);
}

.success h2 {
    margin: 0 0 6px;
    font-size: clamp(22px, 3.5vw, 28px);
    color: #2d3436;
}

.success p {
    color: #636e72;
    margin: 0 0 16px;
}

.success .btn {
    background: linear-gradient(45deg, #6c5ce7, #0984e3);
}

.confetti {
    font-size: 28px;
    margin-bottom: 6px;
}

/* Mobile niceties */
@media (max-width: 480px) {
    .options {
        min-height: 180px;
    }
}
</style>
