<template>
  <div class="event-list">
    <div class="page-header">
      <h2>Event List</h2>
      <router-link to="/create-event" class="btn btn-primary">Create New Event</router-link>
    </div>

    <!-- Search and Filter Controls -->
    <div class="controls">
      <div class="search-box">
        <input
          v-model="searchName"
          @input="searchEvents"
          type="text"
          placeholder="Search by event name..."
          class="search-input"
        />
      </div>
      <div class="filter-box">
        <select v-model="selectedLocation" @change="searchEvents" class="location-filter">
          <option value="">All Locations</option>
          <option v-for="location in locations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>
      </div>
    </div>

    <!-- Events Table -->
    <div class="table-container" v-if="events.length > 0">
      <table class="events-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td>{{ event.name }}</td>
            <td>{{ formatDate(event.date) }}</td>
            <td>{{ event.location }}</td>
            <td>{{ event.description || 'No description' }}</td>
            <td>
              <button @click="confirmDelete(event)" class="btn btn-danger btn-sm">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Events Message -->
    <div v-else class="no-events">
      <p>No events found. <router-link to="/create-event">Create your first event</router-link></p>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 0"
        class="btn btn-secondary"
      >
        Previous
      </button>
      <span class="page-info">
        Page {{ currentPage + 1 }} of {{ totalPages }}
      </span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
        class="btn btn-secondary"
      >
        Next
      </button>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal" @click.stop>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ eventToDelete?.name }}"?</p>
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn btn-secondary">Cancel</button>
          <button @click="deleteEvent" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="loading">Loading events...</div>
  </div>
</template>

<script>
import EventService from '../services/EventService'

export default {
  name: 'EventList',
  data() {
    return {
      events: [],
      currentPage: 0,
      totalPages: 0,
      searchName: '',
      selectedLocation: '',
      locations: [],
      showDeleteModal: false,
      eventToDelete: null,
      message: '',
      messageType: '',
      loading: false
    }
  },
  async mounted() {
    await this.loadEvents()
    await this.loadLocations()
  },
  methods: {
    async loadEvents() {
      try {
        this.loading = true
        const data = await EventService.getEvents(
          this.currentPage,
          5,
          this.searchName,
          this.selectedLocation
        )
        this.events = data.content || []
        this.totalPages = data.totalPages || 0
      } catch (error) {
        this.showMessage('Error loading events. Please try again.', 'error')
      } finally {
        this.loading = false
      }
    },

    async loadLocations() {
      try {
        const response = await EventService.getLocations()
        this.locations = response.data
      } catch (error) {
        console.error('Error loading locations:', error)
      }
    },

    async searchEvents() {
      this.currentPage = 0
      await this.loadEvents()
    },

    async changePage(page) {
      this.currentPage = page
      await this.loadEvents()
    },

    confirmDelete(event) {
      this.eventToDelete = event
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
      this.eventToDelete = null
    },

    async deleteEvent() {
      try {
        await EventService.deleteEvent(this.eventToDelete.id)
        this.showMessage('Event deleted successfully', 'success')
        this.closeDeleteModal()
        await this.loadEvents()
      } catch (error) {
        this.showMessage('Error deleting event', 'error')
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },

    showMessage(text, type) {
      this.message = text
      this.messageType = type
      setTimeout(() => {
        this.message = ''
      }, 3000)
    }
  }
}
</script>

<style scoped>
.event-list {
  padding: 2rem 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input, .location-filter {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-input {
  min-width: 300px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th,
.events-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.events-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-info {
  font-weight: 500;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #7f8c8d;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.message {
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.no-events {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.25rem;
  color: #666;
}
</style>
