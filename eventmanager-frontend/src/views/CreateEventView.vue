<script setup>
import EventForm from '../components/EventForm.vue'
import { ref } from 'vue'

const emit = defineEmits(['eventCreated'])

function handleEventCreated() {
  emit('eventCreated')
}
</script>

<template>
  <div class="create-event-view">
    <div class="form-container">
      <EventForm @created="handleEventCreated" />
    </div>
  </div>
</template>

<style scoped>
.create-event-view {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
  min-height: 60vh;
}

.form-container {
  width: 100%;
  max-width: 600px;
}

@media (max-width: 768px) {
  .create-event-view {
    padding: 1rem;
  }
}
</style>
