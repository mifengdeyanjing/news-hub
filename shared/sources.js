/** 顶部分类 Tab */
export const CATEGORIES = [
  { id: 'all', name: '全部', icon: '🌐' },
  { id: 'ai', name: '人工智能', icon: '🤖' },
  { id: 'economy', name: '财政经济', icon: '💰' },
  { id: 'nation', name: '国家发展', icon: '🏛️' },
  { id: 'tech', name: '科技数码', icon: '💻' },
];

/** 所有 RSS 资讯源 */
export const SOURCES = [
  { id: 'people-finance', name: '人民网财经', icon: '💴', group: 'economy', category: '财政经济', feed: 'http://www.people.com.cn/rss/finance.xml', color: '#c62828' },
  { id: 'chinanews-finance', name: '中新网财经', icon: '📈', group: 'economy', category: '财政经济', feed: 'https://www.chinanews.com.cn/rss/finance.xml', color: '#1565c0' },
  { id: 'xinhua-finance', name: '新华网财经', icon: '🏦', group: 'economy', category: '财政经济', feed: 'http://www.xinhuanet.com/fortune/news_fortune.xml', color: '#2e7d32' },
  { id: 'eeo', name: '经济观察网', icon: '📊', group: 'economy', category: '财政经济', feed: 'https://www.eeo.com.cn/rss.xml', color: '#6a1b9a' },
  { id: 'xinhua-politics', name: '新华网时政', icon: '🇨🇳', group: 'nation', category: '国家发展', feed: 'http://www.xinhuanet.com/politics/news_politics.xml', color: '#b71c1c' },
  { id: 'people-politics', name: '人民网时政', icon: '📜', group: 'nation', category: '国家发展', feed: 'http://www.people.com.cn/rss/politics.xml', color: '#c62828' },
  { id: 'chinanews-china', name: '中新网时政', icon: '🏛️', group: 'nation', category: '国家发展', feed: 'https://www.chinanews.com.cn/rss/china.xml', color: '#1565c0' },
  { id: 'chinanews-scroll', name: '中新网要闻', icon: '📰', group: 'nation', category: '国家发展', feed: 'https://www.chinanews.com.cn/rss/scroll-news.xml', color: '#0277bd' },
  { id: 'qbitai', name: '量子位', icon: '🤖', group: 'ai', category: 'AI资讯', feed: 'https://www.qbitai.com/feed', color: '#0066ff' },
  { id: 'leiphone', name: '雷锋网', icon: '⚡', group: 'ai', category: 'AI产业', feed: 'https://www.leiphone.com/feed', color: '#7c4dff' },
  { id: 'openai', name: 'OpenAI', icon: '🟢', group: 'ai', category: 'AI官方', feed: 'https://openai.com/news/rss.xml', color: '#10a37f' },
  { id: 'google-ai', name: 'Google AI', icon: '🔵', group: 'ai', category: 'AI官方', feed: 'https://blog.google/technology/ai/rss/', color: '#4285f4' },
  { id: 'theverge-ai', name: 'The Verge AI', icon: '📡', group: 'ai', category: 'AI时事', feed: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', color: '#e51225' },
  { id: 'techcrunch-ai', name: 'TechCrunch AI', icon: '🚀', group: 'ai', category: 'AI创投', feed: 'https://techcrunch.com/category/artificial-intelligence/feed/', color: '#0a9e01' },
  { id: 'mit-ai', name: 'MIT科技评论', icon: '🧠', group: 'ai', category: 'AI深度', feed: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', color: '#000000' },
  { id: 'marktechpost', name: 'Marktechpost', icon: '🔬', group: 'ai', category: 'AI研究', feed: 'https://www.marktechpost.com/feed/', color: '#ff6f00' },
  { id: '36kr', name: '36氪', icon: '🔥', group: 'tech', category: '科技创业', feed: 'https://36kr.com/feed', color: '#1a73e8' },
  { id: 'ithome', name: 'IT之家', icon: '💻', group: 'tech', category: '科技资讯', feed: 'https://www.ithome.com/rss/', color: '#d32f2f' },
  { id: 'sspai', name: '少数派', icon: '📝', group: 'tech', category: '数码生活', feed: 'https://sspai.com/feed', color: '#d23f31' },
  { id: 'ifanr', name: '爱范儿', icon: '📱', group: 'tech', category: '数码', feed: 'https://www.ifanr.com/feed', color: '#00b96b' },
  { id: 'geekpark', name: '极客公园', icon: '🚀', group: 'tech', category: '科技', feed: 'https://www.geekpark.net/rss', color: '#ff5722' },
  { id: 'huxiu', name: '虎嗅', icon: '🐯', group: 'tech', category: '商业科技', feed: 'https://www.huxiu.com/rss/0.xml', color: '#ff6b00' },
  { id: 'cnbeta', name: 'cnBeta', icon: '🌐', group: 'tech', category: 'IT资讯', feed: 'https://www.cnbeta.com.tw/backend.php', color: '#009688' },
  { id: 'oschina', name: '开源中国', icon: '🐧', group: 'tech', category: '开源', feed: 'https://www.oschina.net/news/rss', color: '#4caf50' },
  { id: 'v2ex', name: 'V2EX', icon: '💬', group: 'tech', category: '开发者社区', feed: 'https://www.v2ex.com/index.xml', color: '#607d8b' },
];
