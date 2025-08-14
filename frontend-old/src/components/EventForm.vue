<template>
  <div class="event-form">
    <div class="form-header">
      <h2>Create New Event</h2>
      <router-link to="/events" class="btn btn-secondary">Back to Events</router-link>
    </div>

    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="name">Event Name *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          maxlength="100"
          :class="['form-input', { 'error': errors.name }]"
          placeholder="Enter event name"
        />
        <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          :class="['form-input', { 'error': errors.description }]"
          placeholder="Enter event description (optional)"
          rows="4"
        ></textarea>
        <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
      </div>

      <div class="form-group">
        <label for="date">Event Date *</label>
        <input
          id="date"
          v-model="form.date"
          type="date"
          :min="minDate"
          :class="['form-input', { 'error': errors.date }]"
        />
        <div v-if="errors.date" class="error-message">{{ errors.date }}</div>
      </div>

      <div class="form-group">
        <label for="location">Location *</label>
        <input
          id="location"
          v-model="form.location"
          type="text"
          :class="['form-input', { 'error': errors.location }]"
          placeholder="Enter event location"
        />
        <div v-if="errors.location" class="error-message">{{ errors.location }}</div>
      </div>

      <div class="form-actions">
        <button type="button" @click="resetForm" class="btn btn-secondary">Reset</button>
        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Creating...' : 'Create Event' }}
        </button>
      </div>
    </form>

    <!-- Success/Error Messages -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script>
import EventService from '../services/EventService'

export default {
  name: 'EventForm',
  data() {
    return {
      form: {
        name: '',
        description: '',
        date: '',
        location: ''
      },
      errors: {},
      loading: false,
      message: '',
      messageType: ''
    }
  },
  computed: {
    minDate() {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().split('T')[0]
    }
  },
  methods: {
    validateForm() {
      this.errors = {}

      // Validate name
      if (!this.form.name.trim()) {
        this.errors.name = 'Event name is required'
      } else if (this.form.name.length > 100) {
        this.errors.name = 'Event name must not exceed 100 characters'
      }

      // Validate date
      if (!this.form.date) {
        this.errors.date = 'Event date is required'
      } else {
        const selectedDate = new Date(this.form.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (selectedDate <= today) {
          this.errors.date = 'Event date must be in the future'
        }
      }

      // Validate location
      if (!this.form.location.trim()) {
        this.errors.location = 'Location is required'
      }

      return Object.keys(this.errors).length === 0
    },

    async submitForm() {
      if (!this.validateForm()) {
        return
      }

      try {
        this.loading = true
        await EventService.createEvent(this.form)
        this.showMessage('Event created successfully!', 'success')
        this.resetForm()

        // Redirect to events list after 2 seconds
        setTimeout(() => {
          this.$router.push('/events')
        }, 2000)
      } catch (error) {
        this.showMessage('Error creating event. Please try again.', 'error')
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.form = {
        name: '',
        description: '',
        date: '',
        location: ''
      }
      this.errors = {}
      this.message = ''
    },

    showMessage(text, type) {
      this.message = text
      this.messageType = type
      setTimeout(() => {
        this.message = ''
      }, 5000)
    }
  }
}
</script>

<style scoped>
.event-form {
  max-width: 600px;
  margin: 2rem auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.form-input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-primary:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
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
</style>
