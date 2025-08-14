<script setup>
import { computed, ref } from 'vue'
import { createEvent } from '../api/EventService'

const name = ref('')
const description = ref('')
const date = ref('')
const location = ref('')
const loading = ref(false)
const message = ref(null)

const nameError = computed(() => {
  if (!name.value) return 'Name is required'
  if (name.value.length > 100) return 'Max 100 characters'
  return ''
})

const dateError = computed(() => {
  if (!date.value) return 'Date is required'
  const selected = new Date(date.value)
  const today = new Date()
  selected.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  if (selected <= today) return 'Date must be in the future'
  return ''
})

const locationError = computed(() => !location.value ? 'Location is required' : '')
const isValid = computed(() => !nameError.value && !dateError.value && !locationError.value)

const emit = defineEmits(['created'])

async function onSubmit() {
  message.value = null
  if (!isValid.value) return
  loading.value = true
  try {
    await createEvent({
      name: name.value.trim(),
      description: description.value.trim(),
      date: date.value,
      location: location.value.trim()
    })
    message.value = { type: 'success', text: 'Event created successfully' }
    name.value = ''
    description.value = ''
    date.value = ''
    location.value = ''
    emit('created')
  } catch (e) {
    const serverMsg = e?.response?.data?.message || 'Error creating event. Please try again.'
    message.value = { type: 'error', text: serverMsg }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card">
    <h2 class="form-title">Create Event</h2>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label>Name *</label>
        <input v-model="name" class="input" placeholder="Event name" />
        <p v-if="nameError" class="error">{{ nameError }}</p>
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="description" class="textarea" rows="3" placeholder="Optional details"></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Date *</label>
          <input type="date" v-model="date" class="input" />
          <p v-if="dateError" class="error">{{ dateError }}</p>
        </div>

        <div class="form-group">
          <label>Location *</label>
          <input v-model="location" class="input" placeholder="City / Venue" @keydown.enter.prevent />
          <p v-if="locationError" class="error">{{ locationError }}</p>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-primary" type="submit" :disabled="!isValid || loading">
          {{ loading ? 'Saving...' : 'Create' }}
        </button>
        <span v-if="message" :class="message.type === 'success' ? 'success' : 'error'">
          {{ message.text }}
        </span>
      </div>
    </form>
  </div>
</template>

<style scoped src="../EventForm.css"></style>
