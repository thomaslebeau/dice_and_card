import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Force l'utilisation d'une seule instance de React
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    alias: {
      '@': resolve(__dirname, './src'),
      '@types': resolve(__dirname, './src/types'),
      '@enums': resolve(__dirname, './src/enums'),
      '@shared': resolve(__dirname, './src/shared'),
      '@features': resolve(__dirname, './src/features'),
      '@core': resolve(__dirname, './src/core'),
      '@styles': resolve(__dirname, './src/styles'),
    }
  },
})