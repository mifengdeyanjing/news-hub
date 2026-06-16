import { Hono } from 'hono';
import { SOURCES } from '../../shared/sources.js';
import { fetchText } from '../lib/fetch.js';
import { parseFeedXml } from '../lib/rss.js';
import { extractArticleText } from '../lib/article.js';
import { getCache, setCache } from '../lib/cache.js';

export const apiRoutes = new Hono();

const FEED_TIMEOUT = 8000;
const CACHE_TTL = 10 * 60 * 1000;
const ALL_NEWS_KEY = '__all_news__';

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

async function fetchSource(source) {
  const cached = getCache(source.id);
  if (cached) return { items: cached, failed: false };

  try {
    const xml = await fetchText(source.feed, FEED_TIMEOUT);
    const items = enrichItems(parseFeedXml(xml), source);
    setCache(source.id, items, CACHE_TTL);
    return { items, failed: false };
  } catch {
    return { items: [], failed: true };
  }
}

/** 聚合所有 RSS 源（带缓存，10 分钟内秒开） */
apiRoutes.get('/news', async (c) => {
  const cached = getCache(ALL_NEWS_KEY);
  if (cached) return c.json(cached);

  const allItems = [];
  const failedSources = [];

  await Promise.all(
    SOURCES.map(async (source) => {
      const { items, failed } = await fetchSource(source);
      if (failed) failedSources.push(source.name);
      else allItems.push(...items);
    }),
  );

  allItems.sort((a, b) => b.timestamp - a.timestamp);

  const now = new Date();
  const body = {
    items: allItems,
    failedSources,
    updatedAt: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
  };

  setCache(ALL_NEWS_KEY, body, CACHE_TTL);
  return c.json(body);
});

/** 抓取原文全文 */
apiRoutes.get('/article', async (c) => {
  const url = c.req.query('url');
  if (!url) return c.json({ error: '缺少 url 参数' }, 400);

  try {
    const html = await fetchText(url, 10000);
    const text = await extractArticleText(html);
    return c.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : '抓取失败';
    return c.json({ error: message }, 502);
  }
});

apiRoutes.get('/health', (c) => c.json({ ok: true }));
