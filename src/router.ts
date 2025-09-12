import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Memories from './views/Memories.vue'
import Game from './views/Game.vue'
import LoveWall from './views/LoveWall.vue'
import Quiz from './views/Quiz.vue'

export default createRouter({
  history: createWebHashHistory(), // avoids hosting rewrites
  routes: [
    { path: '/', component: Home, meta: { title: 'Happy Birthday 🎂' } },
    { path: '/memories', component: Memories, meta: { title: 'Memories 📸' } },
    { path: '/game', component: Game, meta: { title: 'Balloon Pop 🎈' } },
    { path: '/love-wall', component: LoveWall },
    { path: '/quiz', component: Quiz, meta: { title: 'Romantic Quiz 💘' } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() { return { top: 0 } }
})
