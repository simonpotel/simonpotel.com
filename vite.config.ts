import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 4176
    },
    preview: {
        host: true,
        allowedHosts: ['simonpotel.com'],
        port: 4176
    }
})
