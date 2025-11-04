import { scrapeWebsite } from './scrapeWebsite.js';

// Available functions for the AI agent
const functions = {
  scrapeWebsite
};

// Function metadata for OpenAI function calling
const functionDefinitions = [
  {
    name: 'scrapeWebsite',
    description: 'Scrape content from a website URL and return the main text content, title, and metadata',
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
  }
];

/**
 * Execute a function by name with given arguments
 */
async function executeFunction(functionName, args) {
  if (!functions[functionName]) {
    throw new Error(`Function '${functionName}' not found`);
  }
  
  console.log(`🔧 Executing function: ${functionName}`, args);
  const result = await functions[functionName](args.url);
  console.log(`✅ Function ${functionName} completed`);
  
  return result;
}

export {
  functions,
  functionDefinitions,
  executeFunction
};