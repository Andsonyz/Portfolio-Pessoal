import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { existsSync } from 'node:fs'
import { visitorsPlugin } from './server/visitors-plugin.ts'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visitorsPlugin(),
    {
      name: 'production-content-security-policy',
      apply: 'build',
      transformIndexHtml: (html) =>
        html.replace("connect-src 'self' ws://127.0.0.1:*", "connect-src 'self'"),
    },
  ],
  define: {
    __PROFILE_IMAGE__: JSON.stringify(
      existsSync('public/images/profile/FotoParaPerfil.png')
        ? '/images/profile/FotoParaPerfil.png'
        : existsSync('public/images/perfil.png')
          ? '/images/perfil.png'
          : existsSync('public/images/profile/andson.jpg')
            ? '/images/profile/andson.jpg'
            : null,
    ),
    __RESUME_URL__: JSON.stringify(
      existsSync('public/documents/curriculo-andson-rocha.pdf')
        ? '/documents/curriculo-andson-rocha.pdf'
        : null,
    ),
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: { ignored: ['**/.verification/**'] },
  },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  build: { sourcemap: false },
})
