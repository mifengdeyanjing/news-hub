import { Hono } from 'hono';
import { SOURCES } from '../../shared/sources.js';
import { fetchText } from '../lib/fetch.js';
import { parseFeedXml } from '../lib/rss.js';
import { extractArticleText } from '../lib/article.js';

export const apiRoutes = new Hono();

const FEED_TIMEOUT = 4000;

function enrichItems(items, source) {
  return items.map((item) => ({
    ...item,
    sourceId: source.id,
    sourceName: source.name,
    sourceIcon: source.icon,
    sourceColor: source.color,
    category: source.category,
    group: source.group,
  }));
}

/** 单个 RSS 源（每次只抓一个，避免 Vercel 10s 超时） */
apiRoutes.get('/feed', async (c) => {
  const id = c.req.query('id');
  const source = SOURCES.find((s) => s.id === id);
  if (!source) return c.json({ error: '来源不存在' }, 404);

  try {
    const xml = await fetchText(source.feed, FEED_TIMEOUT);
    const items = enrichItems(parseFeedXml(xml), source);
    return c.json({ items });
  } catch {
    return c.json({ error: '抓取失败' }, 502);
  }
});

/** 抓取原文全文 */
apiRoutes.get('/article', async (c) => {
  const url = c.req.query('url');
  if (!url) return c.json({ error: '缺少 url 参数' }, 400);

  try {
    const html = await fetchText(url, 8000);
    const text = await extractArticleText(html);
    return c.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : '抓取失败';
    return c.json({ error: message }, 502);
  }
});

apiRoutes.get('/health', (c) => c.json({ ok: true }));
