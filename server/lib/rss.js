function decodeEntities(str) {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function cleanText(str) {
  if (!str) return '';
  return decodeEntities(str.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function extractTag(xml, tag) {
  const cdataRe = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRe);
  if (cdataMatch) return cleanText(cdataMatch[1]);

  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(re);
  return match ? cleanText(match[1]) : '';
}

function extractAtomLink(block) {
  const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
  return hrefMatch?.[1] ?? extractTag(block, 'link');
}

function parseDate(dateStr) {
  if (!dateStr) return 0;
  const ts = Date.parse(dateStr);
  return Number.isNaN(ts) ? 0 : ts;
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 从 RSS/Atom XML 中提取条目 */
export function parseFeedXml(xml) {
  const items = [];

  const rssItems = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  for (const block of rssItems) {
    items.push({
      title: extractTag(block, 'title'),
      link: extractTag(block, 'link'),
      description: cleanText(extractTag(block, 'description') || extractTag(block, 'content:encoded')),
      pubDate: extractTag(block, 'pubDate') || extractTag(block, 'dc:date'),
    });
  }

  if (items.length === 0) {
    const atomEntries = xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];
    for (const block of atomEntries) {
      items.push({
        title: extractTag(block, 'title'),
        link: extractAtomLink(block),
        description: cleanText(extractTag(block, 'summary') || extractTag(block, 'content')),
        pubDate: extractTag(block, 'updated') || extractTag(block, 'published'),
      });
    }
  }

  return items.slice(0, 20).map((item) => {
    const timestamp = parseDate(item.pubDate);
    return {
      title: item.title,
      link: item.link,
      description: item.description,
      timestamp,
      timeText: formatRelativeTime(timestamp),
    };
  });
}
