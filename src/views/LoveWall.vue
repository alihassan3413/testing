<script setup lang="ts">
import { ref, computed } from 'vue'

const isPaused = ref(false)
const customText = ref('')
const showLoveExplosion = ref(false)
const totalTarget = 36 // grid looks nice with multiples of 6/9/12

// Enhanced romantic text bank (same as yours)
const ROMANTIC_POEMS = [
    'Your smile is my daily sunshine ☀️',
    'In your eyes, I see my forever 💕',
    'Every moment with you is a treasure 💎',
    'You are my heart\'s favorite song 🎵',
    'Your love makes everything beautiful 🌸',
    'Together we create magic every day ✨',
    'You are my greatest blessing 🙏',
    'Your laughter is my favorite sound 😊',
    'In your arms, I found home 🏠',
    'You make ordinary days extraordinary 🌟',
    'Your kindness lights up my world 💡',
    'Every day I love you more 📈',
    'You are my sweetest dream come true 💭',
    'Your presence is my peace ☮️',
    'You complete my heart perfectly 🧩',
    'Your love is my superpower 💪',
    'With you, life is an adventure 🗺️',
    'You are my favorite hello 👋',
    'Your hugs heal everything 🤗',
    'You make my heart skip beats 💓',

    // ✨ New poetic additions
    'Our love is a garden, always blooming 🌷',
    'You are the moonlight in my darkest night 🌙',
    'Butterflies dance when you walk into the room 🦋',
    'Your love writes poems on the pages of my soul 📜',
    'With you, silence feels like music 🎶',
    'I found eternity the moment I found you ⏳',
    'You are the rainbow after all my storms 🌈',
    'My heart whispers your name with every beat 💗',
    'You are the ink to my unwritten story ✍️',
    'Like stars in the night sky, you light my path ✨',
    'Your voice is my favorite lullaby 🌌',
    'You are the gentle breeze in my summer day 🍃',
    'My love for you flows deeper than oceans 🌊',
    'Every kiss is a promise kept 💋',
    'Your eyes hold galaxies unexplored 🌠',
    'You make my world brighter than the sunrise 🌅',
    'You are the wings of my heart in flight 🕊️',
    'Together, we are poetry in motion 📖',
    'You are my today, tomorrow, and forever ♾️',
    'Butterflies remind me of the way you make me feel 🦋'
]

const LOVE_MESSAGES = [
    'You are absolutely amazing 🌺',
    'My love for you grows daily 🌱',
    'You bring joy to my life 🎉',
    'Your beauty takes my breath away 😍',
    'I am so grateful for you 🙏',
    'You are my perfect match 💕',
    'Your love gives me strength 💪',
    'Every day with you is perfect 🌈',
    'You make me feel so loved ❤️',
    'Your heart is pure gold 💛',
    'I choose you every single day 💍',
    'You are my favorite person 👫',
    'Your love is my safe place 🏡',
    'Together we can conquer anything 🏔️',
    'You make me want to be better 🌟',
    'Your smile melts my heart 💕',
    'I love your beautiful soul 👼',
    'You are my greatest gift 🎁',
    'Your love is my inspiration 💡',
    'Forever grateful for your love 💖',

    // ✨ New butterfly-kissed messages
    'You give me butterflies every single day 🦋',
    'I never believed in magic until I met you ✨',
    'You are the spark that lights my fire 🔥',
    'With you, I am the best version of myself 🌟',
    'You make my heart dance with joy 💃',
    'Every glance from you feels like a blessing 🙏',
    'You are the dream I never want to wake up from 🌌',
    'My soul found its twin in you 💞',
    'You make love feel effortless 💕',
    'You are the melody I didn’t know I needed 🎶',
    'My world feels softer with your love 🌸',
    'You are the treasure I’ll cherish forever 💎',
    'Butterflies surround me when I think of you 🦋',
    'You are the sunrise that awakens my soul 🌅',
    'Loving you feels like breathing—natural and endless 🌬️',
    'You make every ordinary moment extraordinary 🌟',
    'You are the sweetest chapter of my life 📖',
    'You hold the key to my heart 🔑',
    'With you, forever feels too short ⏳',
    'You are my endless spring of happiness 🌼'
]

const showQuiz = ref(false)
const currentQuestion = ref(0)

const QUESTIONS = [
    { q: "Do you love surprises? 🎁", options: ["Yes", "Of course"] },
    { q: "Am I your favorite person? 😏", options: ["Definitely", "Always"] },
    { q: "Do you believe in forever love? ♾️", options: ["Yes", "Yes, with you"] },
    { q: "Will you marry me? 💍", options: ["Yes 💖", "No 🙈"] }
]

function startQuiz() {
    showQuiz.value = true
    currentQuestion.value = 0
}

function nextQuestion() {
    if (currentQuestion.value < QUESTIONS.length - 1) {
        currentQuestion.value++
    } else {
        showQuiz.value = false
        alert("Yaaay! 💕 You said YES!")
    }
}



function getRandomMessage(): string {
    const all = [...ROMANTIC_POEMS, ...LOVE_MESSAGES]
    return all[Math.floor(Math.random() * all.length)]
}

const photoEmojis = ['🌹', '💐', '🌸', '🌺', '🌻', '🌷', '💕', '💖', '💗', '💝', '🎀', '🦋']

type Card = {
    id: number
    text: string
    emoji: string
    floatDelay: number
    baseRotation: number
}

const cards = ref<Card[]>(
    Array.from({ length: totalTarget }, (_, i) => ({
        id: i + 1,
        text: getRandomMessage(),
        emoji: photoEmojis[Math.floor(Math.random() * photoEmojis.length)],
        floatDelay: Math.random() * 3,                // stagger the float
        baseRotation: (Math.random() - 0.5) * 6       // subtle initial tilt
    }))
)

function shuffleMessages() {
    // swap text + emoji randomly
    cards.value = cards.value.map(c => ({
        ...c,
        text: getRandomMessage(),
        emoji: photoEmojis[Math.floor(Math.random() * photoEmojis.length)],
        baseRotation: (Math.random() - 0.5) * 6
    }))
    showLoveExplosion.value = true
    setTimeout(() => (showLoveExplosion.value = false), 900)
}

function addCustomMessage() {
    const text = customText.value.trim()
    if (!text) return
    // prepend as a new card
    const newCard: Card = {
        id: Date.now(),
        text: text + ' 💖',
        emoji: photoEmojis[Math.floor(Math.random() * photoEmojis.length)],
        floatDelay: Math.random() * 3,
        baseRotation: (Math.random() - 0.5) * 6
    }
    cards.value = [newCard, ...cards.value]
    customText.value = ''
}

const dynamicBackground = computed(() => {
    const t = Date.now() * 0.0002
    const hue1 = (200 + Math.sin(t) * 20) % 360
    const hue2 = (240 + Math.cos(t * 0.8) * 25) % 360
    return `
    radial-gradient(ellipse at ${50 + Math.sin(t * 0.5) * 8}% ${40 + Math.cos(t * 0.3) * 10}%, 
      hsla(${hue1}, 60%, 85%, 0.1) 0%, transparent 60%),
    radial-gradient(ellipse at ${60 + Math.cos(t * 0.7) * 12}% ${60 + Math.sin(t * 0.2) * 8}%, 
      hsla(${hue2}, 70%, 80%, 0.08) 0%, transparent 60%),
    linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #f5f7fa 100%)
  `
})

function handleNoHover(opt: string, e: MouseEvent) {
    if (currentQuestion.value === QUESTIONS.length - 1 && opt.includes("No")) {
        const btn = e.target as HTMLElement
        btn.style.position = "absolute"
        btn.style.left = Math.random() * 70 + 10 + "%"
        btn.style.top = Math.random() * 70 + 10 + "%"
    }
}

</script>

<template>
    <section class="polaroid-love-wall" :style="{ background: dynamicBackground }">
        <!-- Header -->
        <header class="polaroid-header">
            <h1 class="polaroid-title">
                <span class="title-text">Our Love Story</span>
                <span class="title-heart">💕</span>
            </h1>
            <p class="polaroid-subtitle">Captured moments of endless love</p>

            <div class="polaroid-controls">
                <button class="control-btn primary" @click="isPaused = !isPaused">
                    {{ isPaused ? '▶️ Continue' : '⏸️ Pause' }}
                </button>

                <button class="control-btn shuffle" @click="shuffleMessages">
                    🔄 New Messages
                </button>

                <div class="message-input-box">
                    <input v-model="customText" placeholder="Add your love note..." @keyup.enter="addCustomMessage"
                        class="message-input" />
                    <RouterLink class="control-btn add" to="/quiz">💘 Play Quiz</RouterLink>


                </div>
            </div>
        </header>

        <!-- Centered GRID of Polaroid cards -->
        <div class="polaroid-grid" :class="{ paused: isPaused }" aria-live="polite">
            <article v-for="c in cards" :key="c.id" class="polaroid-card" :style="{
                '--float-delay': c.floatDelay + 's',
                '--base-rot': c.baseRotation + 'deg'
            }"
                @click="$event.currentTarget?.classList.add('polaroid-flip'); setTimeout(() => $event.currentTarget?.classList.remove('polaroid-flip'), 750)">
                <div class="polaroid-content">
                    <div class="polaroid-photo">
                        <div class="photo-emoji">{{ c.emoji }}</div>
                        <div class="photo-overlay"></div>
                    </div>
                    <div class="polaroid-text">{{ c.text }}</div>
                    <div class="polaroid-shadow"></div>
                </div>
            </article>
        </div>

        <div v-if="showLoveExplosion" class="love-message-overlay">
            <div class="message-text">✨ New Love Messages ✨</div>
        </div>

        <div class="polaroid-hint">
            💫 Click a card to flip it • All cards are centered & readable 💖
        </div>

        <div v-if="showQuiz" class="quiz-overlay">
            <div class="quiz-box">
                <p class="quiz-question">{{ QUESTIONS[currentQuestion].q }}</p>
                <div class="quiz-options">
                    <button v-for="(opt, i) in QUESTIONS[currentQuestion].options" :key="i" class="quiz-btn"
                        @mouseover="handleNoHover(opt, $event)" @click="nextQuestion">
                        {{ opt }}
                    </button>
                </div>
            </div>
        </div>
    </section>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;600&display=swap');

.polaroid-love-wall {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    font-family: 'Poppins', sans-serif;
}

/* Header */
.polaroid-header {
    text-align: center;
    padding: 30px 20px 10px;
    position: relative;
    z-index: 1;
}

.polaroid-title {
    font-family: 'Dancing Script', cursive;
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 700;
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #2c3e50;
}

.title-text {
    background: linear-gradient(45deg, #e74c3c, #f39c12, #e67e22);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gentlePulse 4s ease-in-out infinite;
}

.title-heart {
    animation: heartBeat 2s ease-in-out infinite;
    filter: drop-shadow(0 2px 4px rgba(231, 76, 60, 0.3));
}

.polaroid-subtitle {
    font-size: 16px;
    color: #7f8c8d;
    margin: 0 0 16px;
    font-weight: 300;
    font-style: italic;
}

@keyframes gentlePulse {

    0%,
    100% {
        transform: scale(1)
    }

    50% {
        transform: scale(1.02)
    }
}

@keyframes heartBeat {

    0%,
    100% {
        transform: scale(1)
    }

    50% {
        transform: scale(1.1)
    }
}

/* Controls */
.polaroid-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: center;
}

.control-btn {
    border: 0;
    padding: 10px 18px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: all .3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, .1);
}

.control-btn.primary {
    background: linear-gradient(45deg, #3498db, #2980b9);
    color: #fff;
}

.control-btn.shuffle {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
    color: #fff;
}

.control-btn.add {
    background: linear-gradient(45deg, #2ecc71, #27ae60);
    color: #fff;
    font-weight: 600;
}

.control-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, .15);
}

/* Input */
.message-input-box {
    display: flex;
    gap: 8px;
    align-items: center;
    background: white;
    padding: 4px;
    border-radius: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .1);
}

.message-input {
    background: transparent;
    border: none;
    outline: none;
    color: #2c3e50;
    padding: 8px 16px;
    min-width: min(50vw, 280px);
    font-size: 14px;
}

.message-input::placeholder {
    color: #bdc3c7;
    font-style: italic;
}

/* >>> Centered GRID <<< */
.polaroid-grid {
    /* Full viewport height minus header area for a balanced canvas */
    min-height: calc(100vh - 200px);
    width: min(1200px, 92vw);
    margin: 10px auto 80px auto;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    place-content: center;
    gap: 18px 18px;

    /* floating animation is CSS-based, pausable via this class */
    animation-play-state: running;
}

.polaroid-grid.paused .polaroid-card {
    animation-play-state: paused !important;
}

/* Polaroid Card */
.polaroid-card {
    /* Ensure each card is fully visible and not cut */
    width: 100%;
    max-width: 240px;
    /* keeps them nicely sized on big screens */
    aspect-ratio: 5 / 6;
    margin-inline: auto;

    cursor: pointer;
    will-change: transform, opacity;
    transform: rotate(var(--base-rot, 0deg));
    transition: transform .25s ease, box-shadow .25s ease;

    /* Gentle float (CSS only, staggered) */
    animation: cardFloat 6s ease-in-out infinite;
    animation-delay: var(--float-delay, 0s);
}

@keyframes cardFloat {

    0%,
    100% {
        transform: translateY(0) rotate(var(--base-rot, 0deg));
    }

    50% {
        transform: translateY(-6px) rotate(calc(var(--base-rot, 0deg) + 1.5deg));
    }
}

.polaroid-card:hover {
    transform: translateY(-4px) rotate(0deg);
    z-index: 2;
}

.polaroid-card.polaroid-flip {
    animation: cardFlip .75s ease-in-out;
}

@keyframes cardFlip {
    0% {
        transform: rotateY(0deg)
    }

    50% {
        transform: rotateY(180deg) scale(1.06)
    }

    100% {
        transform: rotateY(360deg)
    }
}

.polaroid-content {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, .12), 0 1px 3px rgba(0, 0, 0, .08);
    overflow: hidden;
}

.polaroid-photo {
    position: relative;
    width: 100%;
    height: 60%;
    background: linear-gradient(135deg, #ffeaa7, #fab1a0, #fd79a8);
    display: grid;
    place-items: center;
    overflow: hidden;
}

.photo-emoji {
    font-size: 48px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, .2));
    animation: gentleRotate 6s ease-in-out infinite;
}

@keyframes gentleRotate {

    0%,
    100% {
        transform: rotate(-5deg) scale(1)
    }

    50% {
        transform: rotate(5deg) scale(1.05)
    }
}

.photo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, .12) 0%, rgba(255, 255, 255, .06) 50%, rgba(0, 0, 0, .05) 100%);
    pointer-events: none;
}

.polaroid-text {
    height: 40%;
    display: grid;
    place-items: center;
    padding: 14px 12px 18px;
    font-size: 13px;
    line-height: 1.45;
    color: #2c3e50;
    text-align: center;
    font-weight: 500;
    background: white;
}

.polaroid-shadow {
    position: absolute;
    bottom: -5px;
    left: 2px;
    right: 2px;
    height: 5px;
    background: rgba(0, 0, 0, .10);
    border-radius: 50%;
    filter: blur(3px);
    z-index: -1;
}

/* Overlay + hint (unchanged) */
.love-message-overlay {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(231, 76, 60, .1);
    backdrop-filter: blur(3px);
    z-index: 500;
    animation: messageOverlay 1s ease-out;
}

.message-text {
    font-family: 'Dancing Script', cursive;
    font-size: clamp(20px, 4vw, 40px);
    font-weight: 700;
    color: #e74c3c;
    text-shadow: 0 2px 10px rgba(231, 76, 60, .3);
    animation: messageGlow 1s ease-in-out infinite;
}

@keyframes messageOverlay {
    0% {
        opacity: 0
    }

    50% {
        opacity: 1
    }

    100% {
        opacity: 0
    }
}

@keyframes messageGlow {

    0%,
    100% {
        text-shadow: 0 2px 10px rgba(231, 76, 60, .3)
    }

    50% {
        text-shadow: 0 4px 20px rgba(231, 76, 60, .6)
    }
}

.polaroid-hint {
    position: sticky;
    bottom: 12px;
    margin: 12px auto;
    width: fit-content;
    background: rgba(255, 255, 255, .9);
    color: #7f8c8d;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .1);
    animation: hintBob 3s ease-in-out infinite;
}

@keyframes hintBob {

    0%,
    100% {
        transform: translateY(0)
    }

    50% {
        transform: translateY(-3px)
    }
}

/* Responsive tweaks */
@media (max-width: 768px) {
    .polaroid-header {
        padding: 20px 15px 10px;
    }

    .polaroid-controls {
        flex-direction: column;
        gap: 10px;
    }

    .message-input-box {
        width: 100%;
        max-width: 320px;
    }

    .message-input {
        min-width: 180px;
    }

    .polaroid-grid {
        width: 94vw;
        gap: 14px;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {

    .title-text,
    .title-heart,
    .photo-emoji,
    .polaroid-card,
    .polaroid-hint {
        animation: none !important;
    }

    .polaroid-card:hover {
        transform: translateY(-2px) !important;
    }
}

.quiz-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.quiz-box {
    background: white;
    padding: 30px;
    border-radius: 16px;
    text-align: center;
    width: min(90%, 400px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

.quiz-question {
    font-size: 20px;
    margin-bottom: 20px;
    color: #e74c3c;
    font-weight: 600;
}

.quiz-options {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    position: relative;
}

.quiz-btn {
    padding: 10px 20px;
    border-radius: 25px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    background: linear-gradient(45deg, #ff7675, #d63031);
    color: white;
    transition: transform 0.3s;
}

.quiz-btn:hover {
    transform: scale(1.1);
}
</style>
