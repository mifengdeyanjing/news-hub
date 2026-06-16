const BASE = '/api';

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? '请求失败');
  }
  return res.json();
}

export function fetchNews() {
  return request('/news');
}

export function fetchStocks() {
  return request('/stocks');
}

export function fetchArticle(url) {
  return request(`/article?url=${encodeURIComponent(url)}`);
}
