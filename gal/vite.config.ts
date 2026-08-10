import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],

    resolve: {
      alias: {
        '@shared': resolve(__dirname, 'src/shared'),
        '@editor': resolve(__dirname, 'src/editor'),
        '@player': resolve(__dirname, 'src/player'),
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },

    // Prevent vite from obscuring Rust errors
    clearScreen: false,

    server: {
      port: 1420,
      strictPort: true,
      watch: {
        // Tell Vite to ignore watching `src-tauri`
        ignored: ['**/src-tauri/**'],
      },
    },

    build: {
      rollupOptions: {
        input: isProduction
          ? // Production: only bundle the player
            { player: resolve(__dirname, 'src/player/index.html') }
          : // Development: include both editor and player
            {
              editor: resolve(__dirname, 'src/editor/index.html'),
              player: resolve(__dirname, 'src/player/index.html'),
            },
      },
      outDir: 'dist',
    },
  };
});
