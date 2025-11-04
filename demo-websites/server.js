import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve blog site on /blog
app.use('/blog', express.static(path.join(__dirname, 'blog-site')));

// Serve news site on /news
app.use('/news', express.static(path.join(__dirname, 'news-site')));

// Landing page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Demo Websites</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        h1 { color: #333; }
        .site-card {
          background: white;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .site-card h2 { color: #667eea; margin-top: 0; }
        .site-card a {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 10px;
        }
        .site-card a:hover { background: #5568d3; }
        .badge {
          display: inline-block;
          background: #ffd700;
          color: #333;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          margin-left: 10px;
        }
      </style>
    </head>
    <body>
      <h1>🌐 Demo Protected Websites</h1>
      <p>These websites will be protected by x402 payment protocol for AI crawlers.</p>
      
      <div class="site-card">
        <h2>🚀 Tech Insights Blog <span class="badge">PREMIUM</span></h2>
        <p>A blog about AI, Web3, and micropayments. Premium content that should be compensated when used for AI training.</p>
        <a href="/blog">Visit Blog Site →</a>
      </div>

      <div class="site-card">
        <h2>📰 Global Tech News <span class="badge">NEWS</span></h2>
        <p>Breaking technology news and updates. Journalism that deserves fair compensation from AI systems.</p>
        <a href="/news">Visit News Site →</a>
      </div>

      <div style="margin-top: 40px; padding: 20px; background: #e8f4fd; border-left: 4px solid #2196F3; border-radius: 4px;">
        <strong>Next Step:</strong> These sites will be protected by a proxy server that:
        <ul style="margin-top: 10px;">
          <li>Detects AI crawlers via User-Agent</li>
          <li>Requires x402 payment from AI bots</li>
          <li>Allows free access for regular users</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n🌐 Demo websites running:`);
  console.log(`   Main page:  http://localhost:${PORT}`);
  console.log(`   Blog site:  http://localhost:${PORT}/blog`);
  console.log(`   News site:  http://localhost:${PORT}/news\n`);
});

