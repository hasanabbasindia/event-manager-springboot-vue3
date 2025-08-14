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
  <div class="card">
    <h2 class="section-title">Upcoming Events</h2>
    <div style="overflow:auto;">
      <table class="table">
        <thead>
        <tr>
          <th class="th">Name</th>
          <th class="th">Date</th>
          <th class="th">Location</th>
          <th class="th">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="e in events" :key="e.id" class="tr">
          <td class="td"><strong>{{ e.name }}</strong></td>
          <td class="td">{{ e.date }}</td>
          <td class="td">{{ e.location }}</td>
          <td class="td">
            <button class="btn btn-danger" @click="onDelete(e.id)">Delete</button>
          </td>
        </tr>
        <tr v-if="events.length === 0">
          <td class="td" colspan="4"><span class="hint">No events found.</span></td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <p class="hint">Page {{ page + 1 }} of {{ pages() }}</p>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-ghost" :disabled="page === 0" @click="page = page - 1; load()">Previous</button>
        <button class="btn btn-ghost" :disabled="page + 1 >= pages()" @click="page = page + 1; load()">Next</button>
      </div>
    </div>
  </div>
</template>