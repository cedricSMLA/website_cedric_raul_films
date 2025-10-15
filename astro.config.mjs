import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  site: process.env.SITE_URL || 'https://cedricraulfilms.fr',
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-FR'
        }
      }
    })
  ],
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
      wrap: true
    }
  },
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto'
  },
  compilerOptions: {
    strict: true
  },
  vite: {
    server: {
      allowedHosts: ['cedricraulfilms.fr', 'www.cedricraulfilms.fr', 'localhost']
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: '_assets/[name].[hash][extname]',
          chunkFileNames: '_assets/[name].[hash].js',
          entryFileNames: '_assets/[name].[hash].js'
        }
      }
    }
  }
});