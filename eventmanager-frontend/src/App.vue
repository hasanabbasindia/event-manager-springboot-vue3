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

onMounted(() => {
  loadLocations()
})
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Event Manager</h1>
        <p class="app-subtitle">Manage your events efficiently</p>
      </div>
    </header>
    
    <main class="app-main">
      <div class="container">
        <div class="content-wrapper">
          <!-- Search and Filter Section -->
          <div class="filters-section">
            <div class="filters-card">
              <div class="filters-grid">
                <div class="filter-group">
                  <label class="filter-label">Search Events</label>
                  <input 
                    v-model="search" 
                    type="text" 
                    placeholder="Search by name..." 
                    class="filter-input"
                  />
                </div>
                <div class="filter-group">
                  <label class="filter-label">Location</label>
                  <select class="filter-select" v-model="location">
                    <option value="">All locations</option>
                    <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label class="filter-label">Sort By</label>
                  <select v-model="sort" class="filter-select">
                    <option value="date,asc">Date (Ascending)</option>
                    <option value="date,desc">Date (Descending)</option>
                  </select>
                </div>
                <div class="filter-group">
                  <button @click="clearFilters" class="btn btn-clear">
                    <span class="btn-icon">🔄</span>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="content-grid">
            <div class="form-section">
              <EventForm @created="handleEventCreated" />
            </div>
            <div class="list-section">
              <EventList 
                ref="listRef"
                v-model="search"
                v-model:location="location"
                v-model:sort="sort"
              />
            </div>
          </div>
        </div>
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
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  align-items: start;
}

.form-section,
.list-section {
  background: transparent;
  padding: 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-clear {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.btn-clear:hover {
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.btn-icon {
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
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
    padding: 1.5rem 1rem;
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