import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // ⬅ 開発では http://localhost:8000 を使う
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist', // ⬅ 本番では dist にビルド成果物が出力される
    },
  };
});
