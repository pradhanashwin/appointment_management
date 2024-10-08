import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  console.log(process.env.VITE_PORT)
  return defineConfig({
      plugins: [react()],

      server: {
        proxy: {
          '/api': {
            target: `${process.env.VITE_APP_HOST}:8000`,  // Backend URL
            changeOrigin: true,
            secure: false,
          },
        },
      },
      define: {
        'process.env': {...process.env, ...loadEnv(mode, process.cwd())}
      }
  });
}