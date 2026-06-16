const BASE = '/api';

const GROUPS = ['ai', 'economy', 'nation', 'tech'];

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? '请求失败');
  }
  return res.json();
}

/** 按分类并行拉取，避免单次请求超过 Vercel 10s 限制 */
export async function fetchNews() {
  const results = await Promise.all(GROUPS.map((group) => request(`/news?group=${group}`)));

  const items = [];
  const failedSet = new Set();

  for (const result of results) {
    items.push(...result.items);
    result.failedSources.forEach((name) => failedSet.add(name));
  }

  items.sort((a, b) => b.timestamp - a.timestamp);

  const now = new Date();
  const updatedAt = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return { items, failedSources: [...failedSet], updatedAt };
}

export function fetchArticle(url) {
  return request(`/article?url=${encodeURIComponent(url)}`);
}
