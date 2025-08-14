import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
})

export async function listEvents({ page = 0, size = 5, name = '', location = '', sort = 'date,asc' } = {}) {
    const params = new URLSearchParams({ page, size, sort })
    if (name) params.append('name', name)
    if (location) params.append('location', location)
    const { data } = await api.get(`/events?${params.toString()}`)
    // handle Spring Page or array fallback
    if (Array.isArray(data)) {
        return { content: data, totalElements: data.length, number: page, size }
    }
    return data
}

export async function createEvent(payload) {
    const { data } = await api.post('/events', payload)
    return data
}

export async function deleteEventById(id) {
    await api.delete(`/events/${id}`)
}

export async function listLocations() {
    try {
        const { data } = await api.get('/events/locations')
        return data || []
    } catch (e) {
        return []
    }
}
