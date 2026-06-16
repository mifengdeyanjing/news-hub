import { SOURCES } from '@shared/sources';

const BASE = '/api';

async function fetchFeed(source) {
  const res = await fetch(`${BASE}/feed?id=${encodeURIComponent(source.id)}`);
  if (!res.ok) throw new Error(source.name);
  const data = await res.json();
  return data.items ?? [];
}

/** 每个来源单独请求，适配 Vercel 10s 函数限制 */
export async function fetchNews() {
  const results = await Promise.allSettled(SOURCES.map((source) => fetchFeed(source)));

  const items = [];
  const failedSources = [];

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      items.push(...result.value);
    } else {
      failedSources.push(SOURCES[i].name);
    }
  });

  items.sort((a, b) => b.timestamp - a.timestamp);

  const now = new Date();
  const updatedAt = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return { items, failedSources, updatedAt };
}

export function fetchArticle(url) {
  return fetch(`${BASE}/article?url=${encodeURIComponent(url)}`).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error ?? '请求失败');
    }
    return res.json();
  });
}
