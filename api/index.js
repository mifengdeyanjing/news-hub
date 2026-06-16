import { handle } from 'hono/vercel';
import { createApp } from '../server/app.js';

export default handle(createApp());
