<script setup>
import { ref, onMounted } from 'vue'
import ErrorModal from '../components/ErrorModal.vue'
import {
  listEvents,
  deleteEventById,
  exportEvents
} from '../api/EventService'

const events = ref([])
const totalElements = ref(0)
const currentPage = ref(0)
const pageSize = ref(5)
const searchQuery = ref('')
const selectedLocation = ref('')
const locations = ref([])
const errorMessage = ref('')
const showError = ref(false)

async function loadEvents(page = currentPage.value) {
  try {
    const data = await listEvents({
      page,
      size: pageSize.value,
      name: searchQuery.value,
      location: selectedLocation.value
    })
    events.value = data.content
    totalElements.value = data.totalElements
    currentPage.value = data.number
  } catch (error) {
    errorMessage.value = 'Failed to load events.'
    showError.value = true
  }
}

// 🔥 New: build unique location list from ALL events across all pages
async function loadLocations() {
  try {
    const data = await listEvents({ page: 0, size: 10000 }) // get all events in one go
    const unique = [...new Set(data.content.map(ev => ev.location))].filter(Boolean)
    locations.value = unique
  } catch (error) {
    errorMessage.value = 'Failed to load locations.'
    showError.value = true
  }
}

async function handleDelete(id) {
  try {
    await deleteEventById(id)
    await loadEvents()
    await loadLocations() // refresh after delete
  } catch (error) {
    errorMessage.value = 'Failed to delete event.'
    showError.value = true
  }
}

async function handleExport() {
  try {
    await exportEvents()
  } catch (error) {
    errorMessage.value = 'Export failed.'
    showError.value = true
  }
}

// 🔥 Properly clears filters and refreshes data
async function clearFilters() {
  searchQuery.value = ''
  selectedLocation.value = ''
  await loadEvents(0)
  await loadLocations()
}

onMounted(() => {
  loadEvents()
  loadLocations()
})
</script>

<template>
  <div class="event-list-view">
    <div class="header">
      <h1 class="title">Event List</h1>
    </div>

    <!-- Filters Card -->
    <div class="filters-card">
      <div class="filters-grid">
        <div class="filter-group">
          <label class="filter-label">Search Events</label>
          <input
              v-model="searchQuery"
              @input="loadEvents(0)"
              type="text"
              placeholder="Search by name..."
              class="filter-input"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">Location</label>
          <select
              class="filter-select"
              v-model="selectedLocation"
              @change="loadEvents(0)"
          >
            <option value="">All locations</option>
            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">&nbsp;</label>
          <button class="btn btn-ghost" @click="clearFilters">Clear</button>
        </div>

        <div class="filter-group export-right">
          <label class="filter-label">&nbsp;</label>
          <button class="excel-btn" @click="handleExport">Export as Excel</button>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="card">
      <table class="table">
        <thead>
        <tr class="tr">
          <th class="th">Name</th>
          <th class="th">Date</th>
          <th class="th">Location</th>
          <th class="th">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr class="tr" v-for="ev in events" :key="ev.id">
          <td class="td">{{ ev.name }}</td>
          <td class="td">{{ ev.date }}</td>
          <td class="td">{{ ev.location }}</td>
          <td class="td">
            <button class="btn btn-danger" @click="handleDelete(ev.id)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button class="btn btn-ghost"
                :disabled="currentPage === 0"
                @click="loadEvents(currentPage - 1)">
          Previous
        </button>

        <span class="hint">
          Page {{ currentPage + 1 }} of
          {{ Math.max(1, Math.ceil(totalElements / pageSize)) }}
        </span>

        <button class="btn btn-ghost"
                :disabled="(currentPage + 1) * pageSize >= totalElements"
                @click="loadEvents(currentPage + 1)">
          Next
        </button>
      </div>
    </div>

    <ErrorModal v-if="showError" :message="errorMessage" @close="showError = false" />
  </div>
</template>

<style scoped>
.event-list-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 1rem;
  max-width: 1400px;
  margin: 0 auto;
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

.list-container {
  flex: 1;
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
  background: linear-gradient(135deg, #ffdd9a 10%, #ffb969 100%);
  color: white;
}

.btn-icon {
  font-size: 1rem;
}

.export-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
  display: flex;
  justify-content: center;
}

.excel-btn {
  background-color: #1d6f42; /* Excel green */
  color: #fff;
  font-weight: 600;
  padding: 0.9rem 2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(29, 111, 66, 0.3);
}

.excel-btn:hover {
  background-color: #155d35;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(29, 111, 66, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .filters-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .event-list-view {
    padding: 1rem;
  }
  .filters-grid {
    grid-template-columns: 1fr;
  }
  .excel-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>
