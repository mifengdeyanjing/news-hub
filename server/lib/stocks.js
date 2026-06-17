import { fetchText } from './fetch.js';
import { STOCK_GROUPS, getWatchlistItems } from '../../shared/sources.js';

const ENDPOINT = 'https://qt.gtimg.cn/q=';
const PK_ENDPOINT = 'https://qt.gtimg.cn/q=s_pk';

function allCodes() {
  return STOCK_GROUPS.flatMap((g) => g.items.map((i) => i.code));
}

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function parseQuoteFields(code, f) {
  const price = num(f[3]);
  const prevClose = num(f[4]);
  const change = f[31] ? num(f[31]) : price - prevClose;
  const percent = f[32] ? num(f[32]) : prevClose ? (change / prevClose) * 100 : 0;

  return {
    price,
    prevClose,
    open: num(f[5]),
    high: num(f[33]),
    low: num(f[34]),
    change,
    percent,
    volume: num(f[6]),
    outer: num(f[7]),
    inner: num(f[8]),
    amount: num(f[37]) / 10000,
    turnover: num(f[38]),
    volumeRatio: num(f[49]) || num(f[50]),
    amplitude: num(f[43]),
    limitUp: num(f[47]),
    limitDown: num(f[48]),
  };
}

/** 拉取所有股票/指数的实时报价，返回 { code: quote } */
export async function fetchStocks() {
  const raw = await fetchText(ENDPOINT + allCodes().join(','), 6000);
  const quotes = {};

  const re = /v_(\w+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(raw))) {
    const code = m[1];
    const f = m[2].split('~');
    if (f.length < 35) continue;
    quotes[code] = parseQuoteFields(code, f);
  }

  return quotes;
}

/** 拉取关注股的盘口分析（大单/小单买卖占比） */
export async function fetchWatchlistOrderBook(codes) {
  if (!codes.length) return {};
  const raw = await fetchText(PK_ENDPOINT + codes.join(','), 6000);
  const result = {};

  for (const code of codes) {
    const re = new RegExp(`v_s_pk${code}="([^"]*)"`, 'g');
    const m = re.exec(raw);
    if (!m) continue;
    const f = m[1].split('~').map((v) => num(v));
    if (f.length >= 4) result[code] = f.slice(0, 4);
  }

  return result;
}

export { getWatchlistItems };
