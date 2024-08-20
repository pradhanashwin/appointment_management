import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default ({ mode }) => {
  return defineConfig({
      plugins: [react()],
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:8000',  // Backend URL
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