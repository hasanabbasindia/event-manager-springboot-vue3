<script setup>
import { onMounted, ref, watch } from 'vue'
import { listEvents, deleteEventById } from '../api/EventService'

const events = ref([])
const page = ref(0)
const size = ref(5)
const totalElements = ref(0)

const search = defineModel({ type: String, default: '' })
const location = defineModel('location', { type: String, default: '' })
const sort = defineModel('sort', { type: String, default: 'date,asc' })

async function load() {
  const data = await listEvents({ page: page.value, size: size.value, name: search.value, location: location.value, sort: sort.value })
  events.value = data.content || []
  totalElements.value = data.totalElements || 0
}

function pages() { return Math.max(1, Math.ceil((totalElements.value || 0) / size.value)) }

async function onDelete(id) {
  if (confirm('Delete this event?')) {
    await deleteEventById(id)
    await load()
  }
}

onMounted(load)
watch([search, location, sort], () => { page.value = 0; load() })

defineExpose({ load })
</script>

<template>
  <div class="event-list-card">
    <h2 class="section-title">Upcoming Events</h2>
    <div class="table-container">
      <table class="events-table">
        <thead>
        <tr>
          <th class="table-header">Name</th>
          <th class="table-header">Date</th>
          <th class="table-header">Location</th>
          <th class="table-header">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="e in events" :key="e.id" class="table-row">
          <td class="table-cell name-cell"><strong>{{ e.name }}</strong></td>
          <td class="table-cell date-cell">
            <span class="date-badge">{{ e.date }}</span>
          </td>
          <td class="table-cell location-cell">
            <span class="location-text">
              <span class="location-icon">📍</span>
              {{ e.location }}
            </span>
          </td>
          <td class="table-cell actions-cell">
            <button class="btn btn-danger" @click="onDelete(e.id)">
              <span class="btn-icon">🗑️</span>
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="events.length === 0">
          <td class="table-cell empty-state" colspan="4">
            <div class="empty-content">
              <div class="empty-icon">📅</div>
              <span class="empty-text">No events found.</span>
              <p class="empty-subtitle">Create your first event to get started</p>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-container">
      <p class="pagination-info">Page {{ page + 1 }} of {{ pages() }}</p>
      <div class="pagination-controls">
        <button class="btn btn-secondary" :disabled="page === 0" @click="page = page - 1; load()">
          <span class="btn-icon">←</span>
          Previous
        </button>
        <button class="btn btn-secondary" :disabled="page + 1 >= pages()" @click="page = page + 1; load()">
          Next
          <span class="btn-icon">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-list-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: right center;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.table-container {
  overflow: auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.8);
  flex: 1;
  max-height: 60vh;
  transition: all 0.4s ease;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.table-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-header:first-child {
  border-top-left-radius: 12px;
}

.table-header:last-child {
  border-top-right-radius: 12px;
}

.table-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.table-row:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateX(4px);
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 1.2rem 1.5rem;
  vertical-align: middle;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.name-cell strong {
  color: #2c3e50;
  font-size: 1.1rem;
}

.date-cell {
  text-align: center;
}

.date-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.85rem;
  display: inline-block;
}

.location-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
}

.location-icon {
  font-size: 1rem;
}

.actions-cell {
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.5;
}

.empty-text {
  color: #6c757d;
  font-size: 1.1rem;
  font-weight: 500;
}

.empty-subtitle {
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
}

.pagination-info {
  color: #6c757d;
  font-weight: 500;
  margin: 0;
}

.pagination-controls {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
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

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
}

.btn-secondary:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
}

.btn-icon {
  font-size: 0.9rem;
}

/* Custom scrollbar for table */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

/* Responsive design */
@media (max-width: 768px) {
  .event-list-card {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .table-header,
  .table-cell {
    padding: 0.75rem 1rem;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .pagination-controls {
    justify-content: center;
  }
  
  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .events-table {
    font-size: 0.85rem;
  }
  
  .table-header,
  .table-cell {
    padding: 0.5rem 0.75rem;
  }
  
  .date-badge {
    padding: 0.3rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>