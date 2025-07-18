import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
    },
    server: {
        port: 3000,
    },
    css: {
        postcss: './postcss.config.ts',
    },
});
