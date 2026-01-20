
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ESTA LÍNEA ES CRUCIAL:
  // Define que las rutas de los assets sean relativas (./) en lugar de absolutas (/)
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Aseguramos que el CSS se minifique correctamente
    cssMinify: true,
  }
})
