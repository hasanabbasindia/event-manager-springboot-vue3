import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import EventList from './components/EventList.vue'
import EventForm from './components/EventForm.vue'

const routes = [
  { path: '/', redirect: '/events' },
  { path: '/events', component: EventList },
  { path: '/create-event', component: EventForm }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Global error handler
const app = createApp(App)
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info)
}

app.use(router).mount('#app')
