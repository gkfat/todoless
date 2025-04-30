/// <reference types="vitest/config" />

import {
    fileURLToPath,
    URL,
} from 'node:url';

import {
    defineConfig,
    loadEnv,
} from 'vite';
// @ts-expect-error temporary workaround for missing types
import eslint from 'vite-plugin-eslint';

import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    console.log(`App mode: ${mode}, API url: ${env.VITE_API_URL}`);

    return {
        plugins: [react(), eslint()], 
        envDir: './',
        resolve: {
            alias: [
                {
                    find: '@',
                    replacement: fileURLToPath(new URL('./src', import.meta.url)), 
                },
            ],
            extensions: [
                '.js',
                '.json',
                '.jsx',
                '.mjs',
                '.ts',
                '.tsx',
                '.vue',
            ],
        },
        test: {
            global: true,
            environment: 'jsdom',
            alias: { '@test': fileURLToPath(new URL('./test', import.meta.url)) },
            coverage: {
                enabled: true,
                reporter: ['html'],
                reportsDirectory: './test/coverage', 
            },
        }, 
    };
});
