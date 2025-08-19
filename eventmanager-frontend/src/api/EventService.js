// src/api/EventService.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'

// Reusable axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
})

// List events with pagination, search, and sorting
export async function listEvents({ page = 0, size = 5, name = '', location = '', sort = 'date,asc' } = {}) {
    const params = new URLSearchParams({ page, size, sort })
    if (name) params.append('name', name)
    if (location) params.append('location', location)

    const { data } = await api.get(`/events?${params.toString()}`)

    // Handle Spring Page or array fallback
    if (Array.isArray(data)) {
        return { content: data, totalElements: data.length, number: page, size }
    }
    return data
}

// Create new event
export async function createEvent(payload) {
    const { data } = await api.post('/events', payload)
    return data
}

// Delete event by ID
export async function deleteEventById(id) {
    await api.delete(`/events/${id}`)
}

// List all unique locations
export async function listLocations() {
    try {
        const { data } = await api.get('/events/locations')
        return data || []
    } catch (e) {
        return []
    }
}

// Export events as Excel file
export async function exportEvents() {
    try {
        const response = await api.get('/events/export', {
            responseType: 'blob',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        })

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url

        // Get filename from response headers or fallback
        const contentDisposition = response.headers['content-disposition']
        let filename = 'events.xlsx'

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/)
            if (filenameMatch) {
                filename = filenameMatch[1]
            }
        }

        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        return true
    } catch (error) {
        console.error('Error exporting events:', error)
        throw error
    }
}

// Export the api instance in case you need it directly
export { api }
