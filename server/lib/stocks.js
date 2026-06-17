import { fetchText } from './fetch.js';
import { STOCK_GROUPS } from '../../shared/sources.js';

const ENDPOINT = 'https://qt.gtimg.cn/q=';

function allCodes() {
  return STOCK_GROUPS.flatMap((g) => g.items.map((i) => i.code));
}

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** 拉取所有股票/指数的实时报价，返回 { code: quote } */
export async function fetchStocks() {
  const raw = await fetchText(ENDPOINT + allCodes().join(','), 6000);
  const quotes = {};

  // 腾讯返回形如 v_sh600519="1~名称~代码~价格~昨收~..."; 数字段均为 ASCII，可安全按 ~ 切分
  const re = /v_(\w+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(raw))) {
    const code = m[1];
    const f = m[2].split('~');
    if (f.length < 35) continue;

    const price = num(f[3]);
    const prevClose = num(f[4]);
    const change = f[31] ? num(f[31]) : price - prevClose;
    const percent = f[32] ? num(f[32]) : prevClose ? (change / prevClose) * 100 : 0;

    quotes[code] = {
      price,
      prevClose,
      open: num(f[5]),
      high: num(f[33]),
      low: num(f[34]),
      change,
      percent,
      amount: num(f[37]) / 10000, // 成交额，万元 → 亿元
      turnover: num(f[38]), // 换手率 %
    };
  }

  return quotes;
}
