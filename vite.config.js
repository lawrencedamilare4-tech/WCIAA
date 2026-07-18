import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';  // ← import
import tailwindcss from '@tailwindcss/vite';   // ← official Tailwind v4 Vite plugin

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
