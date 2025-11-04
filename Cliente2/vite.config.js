import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 9092, // Cambia a 9091 en el otro cliente
    cors: true, // permite llamadas al backend Laravel
  },
});
