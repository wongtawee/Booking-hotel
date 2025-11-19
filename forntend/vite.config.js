import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // กำหนดพอร์ตของ frontend
    proxy: {
      '/api': 'http://localhost:5000',  // กำหนด proxy ให้คำขอ /api ไปยัง backend
    },
  },
});
