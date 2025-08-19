<script setup>
import { ref, onMounted } from 'vue'
import Toolbar from './components/Toolbar.vue'
import EventForm from './components/EventForm.vue'
import EventList from './components/EventList.vue'
import { listEvents } from './api/EventService'

const search = ref('')
const location = ref('')
const sort = ref('date,asc')
const locations = ref([])

const isFormExpanded = ref(false)

let listRef
function refreshList() { listRef && listRef.load && listRef.load() }

// Load unique locations for dropdown
async function loadLocations() {
  try {
    const response = await listEvents({ page: 0, size: 1000 })
    const events = response.content || []
    const uniqueLocations = [...new Set(events.map(event => event.location).filter(Boolean))]
    locations.value = uniqueLocations.sort()
  } catch (error) {
    console.error('Error loading locations:', error)
  }
}

function clearFilters() {
  search.value = ''
  location.value = ''
  sort.value = 'date,asc'
}

function handleEventCreated() {
  refreshList()
  loadLocations() // Refresh locations when new event is created
}

function expandForm() {
  isFormExpanded.value = true
}

function collapseForm() {
  // Add a small delay to prevent immediate collapse when switching between fields
  setTimeout(() => {
    if (!document.querySelector('.form-section input:focus, .form-section textarea:focus, .form-section select:focus')) {
      isFormExpanded.value = false
    }
  }, 100)
}

onMounted(() => {
  loadLocations()
})

import EventListView from './views/EventListView.vue'
import CreateEventView from './views/CreateEventView.vue'

const activeTab = ref('list')

const tabs = [
  { id: 'list', label: 'Event List', icon: '📋' },
  { id: 'create', label: 'Create Event', icon: '➕' }
]

function switchTab(tabId) {
  activeTab.value = tabId
}

function onEventCreated() {
  // Switch to list view after creating an event
  activeTab.value = 'list'
}
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Event Manager</h1>
        <p class="app-subtitle">Manage your events efficiently</p>
        
        <!-- Navigation Tabs -->
        <nav class="tab-navigation">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="switchTab(tab.id)"
            :class="['tab-button', { 'active': activeTab === tab.id }]"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </nav>
      </div>
    </header>
    
    <main class="app-main">
      <!-- Tab Content -->
      <div class="tab-content">
        <Transition name="fade" mode="out-in">
          <EventListView v-if="activeTab === 'list'" key="list" />
          <CreateEventView v-else-if="activeTab === 'create'" key="create" @event-created="onEventCreated" />
        </Transition>
      </div>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8fafc;
}

#app {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #2c3e50;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem 1rem;
  text-align: center;
}

.app-title {
  font-size: 2.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.app-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 2rem;
}

.tab-navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.tab-icon {
  font-size: 1.1rem;
}

.tab-label {
  font-weight: 600;
}

.app-main {
  flex: 1;
}

.tab-content {
  min-height: 60vh;
}

/* Transition animations */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8fafc;
}

#app {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #2c3e50;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
}

.app-title {
  font-size: 2.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.app-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  font-weight: 500;
}

.app-main {
  padding: 2rem 1rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.filters-section {
  margin-bottom: 1rem;
}

.filters-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr auto;
  gap: 1.5rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.filter-input,
.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: rgba(255, 255, 255, 1);
}

.content-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  align-items: start;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: visible;
  position: relative;
}

.content-grid.form-expanded {
  grid-template-columns: 650px 1fr;
  gap: 1rem;
  overflow: hidden;
}

.form-section,
.list-section {
  background: transparent;
  padding: 0;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.form-section {
  width: 100%;
  z-index: 20;
}

.list-section {
  width: 100%;
  transform: translateX(0);
  opacity: 1;
}

.form-expanded .form-section {
  z-index: 30;
}

.form-expanded .list-section {
  transform: translateX(80px);
  opacity: 0.6;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 350px 1fr;
  }
  
  .content-grid.form-expanded {
    grid-template-columns: 550px 1fr;
    overflow: hidden;
  }
  
  .form-expanded .list-section {
    transform: translateX(120px);
    opacity: 0.4;
  }
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    overflow: visible;
  }
  
  .content-grid.form-expanded {
    grid-template-columns: 1fr;
    gap: 2rem;
    overflow: visible;
  }
  
  .form-expanded .list-section {
    transform: translateY(20px);
    opacity: 0.7;
  }
  
  .filters-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .app-title {
    font-size: 2.25rem;
  }
  
  .app-subtitle {
    font-size: 1rem;
  }
  
  .header-content {
    padding: 1.5rem 1rem 1rem;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .app-main {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 1.875rem;
  }
  
  .filters-card {
    padding: 1rem;
  }
}
</style>