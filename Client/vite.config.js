import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// No proxy on purpose: the client calls the API origin directly
// (VITE_API_URL), so production uses the same code path as development.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
  },
});
