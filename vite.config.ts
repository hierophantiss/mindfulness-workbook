import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { globSync } from 'glob';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Find all HTML files at the root to include in the build
  const htmlFiles = globSync('*.html').reduce((acc, file) => {
    const name = path.basename(file, '.html');
    acc[name] = path.resolve(__dirname, file);
    return acc;
  }, {});

  return {
    plugins: [tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: htmlFiles
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
