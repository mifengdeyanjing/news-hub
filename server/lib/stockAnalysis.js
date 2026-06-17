const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function dayRangeAnalysis(quote) {
  const { price, high, low, prevClose } = quote;
  const range = high - low;

  if (range <= 0 || !price) {
    return {
      positionPct: 50,
      label: '价格横盘',
      nearHigh: false,
      nearLow: false,
      distToHighPct: 0,
      distToLowPct: 0,
    };
  }

  const positionPct = ((price - low) / range) * 100;
  const distToHighPct = ((high - price) / price) * 100;
  const distToLowPct = ((price - low) / price) * 100;

  let label;
  if (positionPct <= 15) label = '接近日内最低点';
  else if (positionPct >= 85) label = '接近日内最高点';
  else if (positionPct <= 35) label = '偏低位运行';
  else if (positionPct >= 65) label = '偏高位运行';
  else label = '中间震荡';

  return {
    positionPct: Math.round(positionPct),
    label,
    nearHigh: positionPct >= 85,
    nearLow: positionPct <= 15,
    distToHighPct: Math.round(distToHighPct * 100) / 100,
    distToLowPct: Math.round(distToLowPct * 100) / 100,
    amplitude: prevClose ? Math.round((range / prevClose) * 10000) / 100 : 0,
  };
}

function orderFlowAnalysis(quote) {
  const outer = quote.outer || 0;
  const inner = quote.inner || 0;
  const total = outer + inner;

  if (!total) {
    return { outer: 0, inner: 0, outerPct: 50, innerPct: 50, ratio: 1, label: '暂无成交' };
  }

  const outerPct = Math.round((outer / total) * 1000) / 10;
  const innerPct = Math.round((inner / total) * 1000) / 10;
  const ratio = inner ? Math.round((outer / inner) * 100) / 100 : outer;

  let label;
  if (outerPct >= 58) label = '买盘明显占优';
  else if (outerPct >= 52) label = '买盘略占优势';
  else if (innerPct >= 58) label = '卖盘明显占优';
  else if (innerPct >= 52) label = '卖盘略占优势';
  else label = '多空基本均衡';

  return { outer, inner, outerPct, innerPct, ratio, label };
}

function openGapAnalysis(quote) {
  const { open, prevClose } = quote;
  if (!prevClose) return { type: '平开', pct: 0, label: '平开' };

  const pct = Math.round(((open - prevClose) / prevClose) * 10000) / 100;
  let type;
  if (pct >= 0.5) type = '高开';
  else if (pct <= -0.5) type = '低开';
  else type = '平开';

  const sign = pct > 0 ? '+' : '';
  return {
    type,
    pct,
    label: type === '平开' ? '平开' : `${type} ${sign}${pct}%`,
  };
}

function limitAnalysis(quote) {
  const { price, limitUp, limitDown } = quote;
  if (!price || !limitUp || !limitDown) {
    return { limitUp: 0, limitDown: 0, toLimitUpPct: 0, toLimitDownPct: 0, label: '' };
  }

  const toLimitUpPct = Math.round(((limitUp - price) / price) * 10000) / 100;
  const toLimitDownPct = Math.round(((price - limitDown) / price) * 10000) / 100;

  let label;
  if (toLimitUpPct <= 0.1) label = '触及涨停附近';
  else if (toLimitDownPct <= 0.1) label = '触及跌停附近';
  else if (toLimitUpPct <= 2) label = '接近涨停';
  else if (toLimitDownPct <= 2) label = '接近跌停';

  return { limitUp, limitDown, toLimitUpPct, toLimitDownPct, label };
}

function orderBookAnalysis(pk) {
  if (!pk) return null;

  const [bigBuy, smallBuy, bigSell, smallSell] = pk;
  const buyPct = Math.round((bigBuy + smallBuy) * 1000) / 10;
  const sellPct = Math.round((bigSell + smallSell) * 1000) / 10;

  let label;
  if (bigBuy > bigSell + 0.08) label = '大单买入积极';
  else if (bigSell > bigBuy + 0.08) label = '大单卖出积极';
  else if (smallBuy > smallSell + 0.08) label = '小单买入较多';
  else if (smallSell > smallBuy + 0.08) label = '小单卖出较多';
  else label = '大单小单均衡';

  return {
    bigBuyPct: Math.round(bigBuy * 1000) / 10,
    smallBuyPct: Math.round(smallBuy * 1000) / 10,
    bigSellPct: Math.round(bigSell * 1000) / 10,
    smallSellPct: Math.round(smallSell * 1000) / 10,
    buyPct,
    sellPct,
    label,
  };
}

function buildSignals(quote, dayRange, orderFlow, openGap, limits, orderBook) {
  const signals = [];

  if (dayRange.nearLow) signals.push(`接近日内最低 ${quote.low}，距低点仅 ${dayRange.distToLowPct}%`);
  else if (dayRange.nearHigh) signals.push(`接近日内最高 ${quote.high}，距高点仅 ${dayRange.distToHighPct}%`);
  else signals.push(`日内位置 ${dayRange.positionPct}%（低 ${quote.low} → 高 ${quote.high}）`);

  signals.push(`${orderFlow.label}（外盘 ${orderFlow.outerPct}% / 内盘 ${orderFlow.innerPct}%）`);

  if (openGap.type !== '平开') signals.push(`今${openGap.label}，开盘 ${quote.open}`);

  if (limits.label) signals.push(limits.label);
  else if (limits.toLimitUpPct || limits.toLimitDownPct) {
    signals.push(`距涨停 ${limits.toLimitUpPct}% · 距跌停 ${limits.toLimitDownPct}%`);
  }

  if (quote.volumeRatio > 0) {
    const volLabel =
      quote.volumeRatio >= 2 ? '放量' : quote.volumeRatio <= 0.6 ? '缩量' : '量能正常';
    signals.push(`量比 ${quote.volumeRatio.toFixed(2)}（${volLabel}）`);
  }

  if (orderBook) signals.push(`盘口：${orderBook.label}`);

  return signals;
}

function buildSummary(name, quote, dayRange, orderFlow, openGap) {
  const trend = quote.percent >= 0 ? '上涨' : '下跌';
  const parts = [
    `${name}现报 ${quote.price} 元，${trend} ${Math.abs(quote.percent).toFixed(2)}%`,
    dayRange.label,
    orderFlow.label.replace(/（.*?）/, ''),
  ];
  if (openGap.type !== '平开') parts.push(openGap.label);
  return parts.join('，') + '。';
}

/** 为「我的关注」生成专属分析 */
export function analyzeWatchlistQuote(name, quote, orderBookPk) {
  if (!quote?.price) return null;

  const dayRange = dayRangeAnalysis(quote);
  const orderFlow = orderFlowAnalysis(quote);
  const openGap = openGapAnalysis(quote);
  const limits = limitAnalysis(quote);
  const orderBook = orderBookAnalysis(orderBookPk);

  return {
    dayRange,
    orderFlow,
    openGap,
    limits,
    orderBook,
    signals: buildSignals(quote, dayRange, orderFlow, openGap, limits, orderBook),
    summary: buildSummary(name, quote, dayRange, orderFlow, openGap),
  };
}
