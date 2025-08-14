<script setup>
import { ref, computed } from 'vue'
import { createEvent } from '../api/EventService'

const event = ref({
  name: '',
  description: '',
  date: '',
  location: ''
})

const message = ref(null)
const isSubmitting = ref(false)

const emit = defineEmits(['created'])

const isValid = computed(() => {
  return event.value.name && event.value.date && event.value.location
})

async function handleSubmit() {
  message.value = null
  if (!isValid.value) return
  
  isSubmitting.value = true
  try {
    await createEvent(event.value)
    
    // Reset form
    event.value = {
      name: '',
      description: '',
      date: '',
      location: ''
    }
    
    emit('created')
    showSuccessMessage()
  } catch (error) {
    console.error('Error creating event:', error)
    message.value = 'Error creating event. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

function showSuccessMessage() {
  // Create a temporary success message
  const messageEl = document.createElement('div')
  messageEl.textContent = 'Event created successfully!'
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    z-index: 1000;
    font-weight: 500;
  `
  document.body.appendChild(messageEl)
  
  setTimeout(() => {
    document.body.removeChild(messageEl)
  }, 3000)
}
</script>

<template>
  <div class="event-form-card">
    <h2 class="form-title">Create New Event</h2>
    
    <div v-if="message" class="error-message">
      {{ message }}
    </div>
    
    <form @submit.prevent="handleSubmit" class="event-form">
      <div class="form-group">
        <label for="name" class="form-label">Event Name *</label>
        <input
          id="name"
          v-model="event.name"
          type="text"
          class="form-input"
          placeholder="Enter event name"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          v-model="event.description"
          class="form-textarea"
          placeholder="Enter event description (optional)"
          rows="4"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="date" class="form-label">Event Date *</label>
        <input
          id="date"
          v-model="event.date"
          type="date"
          class="form-input"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="location" class="form-label">Location *</label>
        <input
          id="location"
          v-model="event.location"
          type="text"
          class="form-input"
          placeholder="Enter event location"
          required
        />
      </div>
      
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting || !isValid">
        <span v-if="isSubmitting" class="btn-spinner"></span>
        <span v-else class="btn-icon">➕</span>
        {{ isSubmitting ? 'Creating Event...' : 'Create Event' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.event-form-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-message {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: rgba(255, 255, 255, 1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 1rem;
}

.btn:hover:not(:disabled) {
  transform: translateY(-3px);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  font-size: 1.1rem;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .event-form-card {
    padding: 1.5rem;
    position: static;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .btn {
    padding: 0.875rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .event-form-card {
    padding: 1rem;
  }
  
  .form-input,
  .form-textarea {
    padding: 0.75rem;
  }
}
</style>
