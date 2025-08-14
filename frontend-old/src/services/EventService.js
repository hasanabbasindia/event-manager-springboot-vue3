import axios from 'axios'

const API_BASE_URL =
    process.env.VUE_APP_API_BASE_URL || 'http://localhost:8081/api' // <-- stop hardcoding /events here

console.log('API Base URL:', API_BASE_URL)

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
})

api.interceptors.request.use(
    config => {
        console.log('API Request:', config.method?.toUpperCase(), config.url)
        return config
    },
    error => Promise.reject(error)
)

api.interceptors.response.use(
    response => {
        console.log('API Response:', response.status, response.config.url)
        return response
    },
    error => {
        console.error('Response error:', error.response?.status, error.message)
        return Promise.reject(error)
    }
)

export default {
    async getEvents(page = 0, size = 5, name = '', location = '') {
        const params = new URLSearchParams({ page, size })
        if (name) params.append('name', name)
        if (location) params.append('location', location)

        const response = await api.get(`/events?${params.toString()}`)
        return response.data
    },

    async createEvent(event) {
        const response = await api.post('/events', event) // <-- now explicitly hitting /events
        return response.data
    },

    async deleteEvent(id) {
        await api.delete(`/events/${id}`)
    },

    async getLocations() {
        const response = await api.get('/events/locations')
        return response.data || []
    }
}
