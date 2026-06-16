import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { apiRoutes } from './routes/api.js';

export const app = new Hono();
const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3001;

app.use('/*', cors());
app.route('/api', apiRoutes);

if (isProd) {
  // 静态资源（JS/CSS/图标/PWA）
  app.use('/*', serveStatic({ root: './dist' }));
  // SPA 路由回退
  app.get('*', serveStatic({ path: './dist/index.html' }));
}

serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running at http://localhost:${port}`);
});
