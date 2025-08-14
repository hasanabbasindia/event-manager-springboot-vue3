<script setup>
import { onMounted, ref, watch } from 'vue'
import { listLocations } from '../api/EventService'

const model = defineModel({ type: String, default: '' }) // search by name
const location = defineModel('location', { type: String, default: '' })
const sort = defineModel('sort', { type: String, default: 'date,asc' })

const locations = ref([])

onMounted(async () => {
  const fetched = await listLocations()
  // Fallback default options if API not implemented
  locations.value = fetched.length ? fetched : ['Pune', 'Mumbai', 'Bengaluru', 'Delhi']
})

watch([model, location, sort], () => {})
</script>

<template>
  <div class="toolbar">
    <input class="input" v-model="model" placeholder="Search by name..." />

    <select class="select" v-model="location">
      <option value="">All locations</option>
      <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
    </select>

    <select class="select" v-model="sort">
      <option value="date,asc">Date ↑</option>
      <option value="date,desc">Date ↓</option>
    </select>
  </div>
</template>