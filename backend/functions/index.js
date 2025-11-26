import { scrapeWebsite, metadata as scrapeMetadata } from './scrapeWebsite.js';
import { getWalletBalance, metadata as balanceMetadata } from './getWalletBalance.js';

// Available functions for the AI agent
const functions = {
  scrapeWebsite,
  getWalletBalance
};

// Function metadata for OpenAI function calling
const functionDefinitions = [
  scrapeMetadata,
  balanceMetadata
];

/**
 * Execute a function by name with given arguments
 */
async function executeFunction(functionName, args) {
  if (!functions[functionName]) {
    throw new Error(`Function '${functionName}' not found`);
  }

  console.log(`🔧 Executing function: ${functionName}`, args);

  // Handle different function signatures
  let result;
  if (functionName === 'scrapeWebsite') {
    result = await functions[functionName](args.url, args.userId);
  } else if (functionName === 'getWalletBalance') {
    result = await functions[functionName](args.address);
  } else {
    // Generic call for other functions
    result = await functions[functionName](args);
  }

  console.log(`✅ Function ${functionName} completed`);

  return result;
}

export {
  functions,
  functionDefinitions,
  executeFunction
};