// AI Crawler detection patterns
export const AI_CRAWLERS = [
  /GPTBot/i,           // OpenAI
  /ChatGPT-User/i,     // ChatGPT
  /Claude-Web/i,       // Anthropic Claude
  /anthropic-ai/i,     // Anthropic
  /Google-Extended/i,  // Google AI training
  /GoogleOther/i,      // Google
  /CCBot/i,            // Common Crawl
  /cohere-ai/i,        // Cohere
  /PerplexityBot/i,    // Perplexity
  /Bytespider/i,       // ByteDance
  /FacebookBot/i,      // Meta AI
  /Applebot-Extended/i,// Apple AI
  /Diffbot/i,          // Diffbot
  /ImagesiftBot/i,     // AI image training
  /Omgilibot/i,        // AI training
  /YouBot/i,           // You.com AI
];

/**
 * Detects if a user-agent string belongs to an AI crawler
 * @param {string} userAgent - The User-Agent header value
 * @returns {boolean} - True if AI crawler detected
 */
export function isAICrawler(userAgent) {
  if (!userAgent) return false;
  return AI_CRAWLERS.some(pattern => pattern.test(userAgent));
}

/**
 * Express middleware to detect AI crawlers
 */
export function detectAICrawler(req, res, next) {
  const userAgent = req.get('User-Agent') || '';
  
  req.isAICrawler = isAICrawler(userAgent);
  
  // Log the request
  const crawlerStatus = req.isAICrawler ? '🤖 AI CRAWLER' : '👤 HUMAN';
  console.log(`${crawlerStatus} | ${req.method} ${req.path} | UA: ${userAgent.substring(0, 50)}...`);
  
  if (req.isAICrawler) {
    console.log(`   💰 Payment required for crawler: ${userAgent}`);
  }
  
  next();
}

