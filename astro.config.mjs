// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: "https://zch720.github.io/",
    base: "/",
    redirects: {
        "/": "/main"
    },
    vite: {
        plugins: [
            tailwindcss()
        ]
    },
    build: {
        assets: "assets"
    }
});
