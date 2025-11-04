import express from "express";

const router = express.Router();

// Configuration
const DEMO_SITE_URL = process.env.DEMO_SITE_URL || 'http://localhost:3002';

/**
 * Generic proxy handler - simply forwards requests to demo sites
 */
function createProxyHandler() {
  return async (req, res) => {
    try {
      const targetUrl = `${DEMO_SITE_URL}${req.path}`;
      const response = await fetch(targetUrl);
      const html = await response.text();
      
      res.send(html);
    } catch (error) {
      res.status(500).send(`
        <h1>Error</h1>
        <p>Could not fetch content from demo site. Make sure it's running on port 3002.</p>
        <p>Run: <code>cd demo-websites && npm start</code></p>
        <p>Error: ${error.message}</p>
      `);
    }
  };
}

// Blog route
router.get('/blog', createProxyHandler());

// News route
router.get('/news', createProxyHandler());

// Home page
router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>x402 Protected Content Proxy</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 900px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        h1 { color: #667eea; }
        .info-box {
          background: white;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .site-link {
          display: block;
          background: #667eea;
          color: white;
          padding: 15px;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 0;
          text-align: center;
          font-weight: bold;
        }
        .site-link:hover { background: #5568d3; }
        .price { color: #27ae60; font-weight: bold; }
        .status {
          background: #e8f4fd;
          border-left: 4px solid #2196F3;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .crawler-list {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        code {
          background: #f4f4f4;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
      </style>
    </head>
    <body>
      <h1>🛡️ x402 Protected Content Proxy</h1>
      <p>This proxy server protects websites and enforces micropayments for AI crawlers.</p>
      
      <div class="status">
        <strong>Your Status:</strong> ${req.isAICrawler ? '🤖 Detected as AI Crawler - Payment Required' : '👤 Human User - Free Access'}
        <br><small>User-Agent: ${req.get('User-Agent')}</small>
      </div>

      <div class="info-box">
        <h2>Protected Websites</h2>
        <p>Access these sites through the proxy:</p>
        
        <a href="/blog" class="site-link">
          🚀 Tech Insights Blog
          <br><small>AI Crawlers: <span class="price">$0.005 USDC</span> | Humans: FREE</small>
        </a>
        
        <a href="/news" class="site-link">
          📰 Global Tech News
          <br><small>AI Crawlers: <span class="price">$0.003 USDC</span> | Humans: FREE</small>
        </a>
      </div>

      <div class="crawler-list">
        <h3>🤖 Detected AI Crawlers</h3>
        <p>The following user-agents require payment:</p>
        <ul>
          <li>GPTBot (OpenAI)</li>
          <li>ChatGPT-User</li>
          <li>Claude-Web (Anthropic)</li>
          <li>Google-Extended</li>
          <li>CCBot (Common Crawl)</li>
          <li>PerplexityBot</li>
          <li>And many more...</li>
        </ul>
      </div>

      <div class="info-box">
        <h3>How to Test</h3>
        <p><strong>Regular Browser:</strong> Just click the links above - you get free access!</p>
        <p><strong>Simulate AI Crawler:</strong> Use curl with a bot user-agent:</p>
        <code>curl -H "User-Agent: GPTBot/1.0" http://localhost:4022/blog</code>
        <p style="margin-top: 10px;"><small>Note: AI crawler requests will require x402 payment authentication.</small></p>
      </div>
    </body>
    </html>
  `);
});

export default router;

