import { Hono } from 'hono';
import { SOURCES } from '../../shared/sources.js';
import { fetchText } from '../lib/fetch.js';
import { parseFeedXml } from '../lib/rss.js';
import { extractArticleText } from '../lib/article.js';

export const apiRoutes = new Hono();

const FEED_TIMEOUT = 5000;

async function fetchSources(sources) {
  const allItems = [];
  const failedSources = [];

  await Promise.all(
    sources.map(async (source) => {
      try {
        const xml = await fetchText(source.feed, FEED_TIMEOUT);
        const items = parseFeedXml(xml);
        for (const item of items) {
          allItems.push({
            ...item,
            sourceId: source.id,
            sourceName: source.name,
            sourceIcon: source.icon,
            sourceColor: source.color,
            category: source.category,
            group: source.group,
          });
        }
      } catch {
        failedSources.push(source.name);
      }
    }),
  );

  return { allItems, failedSources };
}

/** 聚合 RSS 资讯，支持 ?group=ai 按分类拉取（避免 Vercel 10s 超时） */
apiRoutes.get('/news', async (c) => {
  const group = c.req.query('group');
  const sources = group ? SOURCES.filter((s) => s.group === group) : SOURCES;

  if (group && sources.length === 0) {
    return c.json({ error: '无效的分类' }, 400);
  }

  const { allItems, failedSources } = await fetchSources(sources);
  allItems.sort((a, b) => b.timestamp - a.timestamp);

  const now = new Date();
  const updatedAt = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return c.json({ items: allItems, failedSources, updatedAt });
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
