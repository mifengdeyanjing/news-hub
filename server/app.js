import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { apiRoutes } from './routes/api.js';

/** 创建 API 应用（本地开发与 Vercel 共用） */
export function createApp() {
  const app = new Hono();
  app.use('/*', cors());
  app.route('/api', apiRoutes);
  return app;
}
