import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5173,
        proxy: {
            // Proxy API during development to Spring Boot on 8081
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true
            }
        }
    }
})