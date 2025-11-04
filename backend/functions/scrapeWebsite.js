import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrape website content from a given URL
 * @param {string} url - The website URL to scrape
 * @returns {Promise<Object>} - Scraped content with title, text, and metadata
 */
async function scrapeWebsite(url) {
  try {
    console.log('🌐 Scraping website:', url);
    
    // Fetch the HTML from the website
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Load HTML into cheerio for parsing
    const $ = cheerio.load(response.data);
    
    // Remove script and style elements
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    $('.advertisement').remove();
    $('.ads').remove();

    // Extract title
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'No title found';
    
    // Extract main content (try different selectors)
    let mainContent = '';
    
    // Try common content containers
    const contentSelectors = [
      'main',
      'article', 
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '#content',
      '.main-content'
    ];
    
    for (const selector of contentSelectors) {
      const content = $(selector).text().trim();
      if (content && content.length > mainContent.length) {
        mainContent = content;
      }
    }
    
    // If no main content found, get body text
    if (!mainContent) {
      mainContent = $('body').text().trim();
    }
    
    // Clean up the text
    mainContent = mainContent
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n')  // Clean up line breaks
      .trim();
    
    // Limit content length
    if (mainContent.length > 3000) {
      mainContent = mainContent.substring(0, 3000) + '... [content truncated]';
    }
    
    // Extract some metadata
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || '';
    
    const author = $('meta[name="author"]').attr('content') || 
                  $('[rel="author"]').text().trim() || '';

    const result = {
      success: true,
      url: url,
      title: title,
      description: description,
      author: author,
      content: mainContent,
      contentLength: mainContent.length,
      scrapedAt: new Date().toISOString()
    };

    console.log('✅ Successfully scraped:', title);
    return result;

  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    
    return {
      success: false,
      url: url,
      error: error.message,
      scrapedAt: new Date().toISOString()
    };
  }
}

// Function metadata for AI agent
const metadata = {
  name: 'scrapeWebsite',
  description: 'Scrape content from a website URL and return the main text content',
  parameters: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The website URL to scrape (must include http:// or https://)'
      }
    },
    required: ['url']
  }
};

export {
  scrapeWebsite,
  metadata
};