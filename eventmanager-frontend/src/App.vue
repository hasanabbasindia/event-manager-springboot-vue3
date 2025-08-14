<script setup>
import { ref } from 'vue'
import Toolbar from './components/Toolbar.vue'
import EventForm from './components/EventForm.vue'
import EventList from './components/EventList.vue'

const search = ref('')
const location = ref('')
const sort = ref('date,asc')

let listRef
function refreshList() { listRef && listRef.load && listRef.load() }
</script>

<template>
  <div class="container">
    <header class="header">
      <h1 class="title">Hasan's Event Manager</h1>
    </header>

    <Toolbar v-model="search" v-model:location="location" v-model:sort="sort" />

    <div class="grid" style="margin-top: 20px;">
      <EventForm @created="refreshList" />
      <EventList ref="listRef" v-model="search" v-model:location="location" v-model:sort="sort" />
    </div>
  </div>
</template>