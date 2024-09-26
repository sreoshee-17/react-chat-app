import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // The folder where Vite will output the build files
  },
  base: '/',  // This base URL is important for Firebase Hosting to work correctly
});

