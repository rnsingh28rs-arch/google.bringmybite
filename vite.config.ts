import 'dotenv/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

import express from 'express';
import contactHandler from './api/contact.ts';
import assistantHandler from './api/assistant.ts';
import adminAuthHandler from './api/admin-auth.ts';
import adminMonetizationHandler from './api/admin-monetization.ts';
import newsletterHandler from './api/newsletter.ts';
import trackClickHandler from './api/track-click.ts';
import adminAnalyticsHandler from './api/admin-analytics.ts';
import userHandler from './api/user.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function devApiPlugin() {
  return {
    name: 'dev-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(express.json());
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const urlPath = req.url ? req.url.split('?')[0].replace(/\/+$/, '') : '';
        
        try {
          if (urlPath === '/api/contact') {
            await contactHandler(req, res);
            return;
          }
          if (urlPath === '/api/assistant') {
            await assistantHandler(req, res);
            return;
          }
          if (urlPath === '/api/admin/auth' || urlPath === '/api/admin-auth') {
            await adminAuthHandler(req, res);
            return;
          }
          if (urlPath === '/api/admin/monetization' || urlPath === '/api/admin-monetization') {
            await adminMonetizationHandler(req, res);
            return;
          }
          if (urlPath === '/api/admin/analytics' || urlPath === '/api/admin-analytics') {
            await adminAnalyticsHandler(req, res);
            return;
          }
          if (urlPath === '/api/user' || urlPath.startsWith('/api/user/')) {
            await userHandler(req, res);
            return;
          }
          if (urlPath === '/api/newsletter') {
            await newsletterHandler(req, res);
            return;
          }
          if (urlPath === '/api/track-click') {
            await trackClickHandler(req, res);
            return;
          }
          next();
        } catch (e: any) {
          console.error('[Dev API Error]', urlPath, e);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Internal server error in dev API', details: e?.message }));
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
          },
        },
      },
    },
  };
});
