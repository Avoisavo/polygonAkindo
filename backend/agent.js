import OpenAI from 'openai';
import { functionDefinitions, executeFunction } from './functions/index.js';

// OpenAI client will be initialized when needed
let openai = null;

function initializeOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

/**
 * AI Agent Brain - Communicates with LLM and handles function calling
 * Takes user input and returns LLM response
 */
async function processMessage(userMessage) {
  try {
    console.log('🧠 Agent processing message:', userMessage);
    
    // Initialize OpenAI client when first needed
    const openaiClient = initializeOpenAI();
    
    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant with access to web scraping capabilities. When users ask you to scrape a website, use the scrapeWebsite function. Be helpful and provide clear responses about the content you find."
      },
      {
        role: "user",
        content: userMessage
      }
    ];

    // First call to see if function calling is needed
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      functions: functionDefinitions,
      function_call: "auto",
      max_tokens: 1000,
      temperature: 0.7,
    });

    const responseMessage = completion.choices[0].message;

    // Check if AI wants to call a function
    if (responseMessage.function_call) {
      console.log('🔧 AI requesting function call:', responseMessage.function_call.name);
      
      // Execute the function
      const functionName = responseMessage.function_call.name;
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);
      
      const functionResult = await executeFunction(functionName, functionArgs);
      
      // Check if function result is a payment request
      if (functionResult.paymentRequired === true) {
        console.log('💳 Payment required - returning payment request to user');
        return functionResult; // Return payment request directly to frontend
      }
      
      // Add function call and result to conversation
      messages.push(responseMessage);
      messages.push({
        role: "function",
        name: functionName,
        content: JSON.stringify(functionResult)
      });
      
      // Get final response from AI after function execution
      const finalCompletion = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      });
      
      const finalResponse = finalCompletion.choices[0].message.content;
      console.log('🧠 Agent response with function result generated');
      
      return finalResponse;
    } else {
      // No function call needed, return direct response
      const response = responseMessage.content;
      console.log('🧠 Agent response generated');
      
      return response;
    }
  } catch (error) {
    console.error('❌ Error in agent processing:', error.message);
    throw new Error(`AI Agent Error: ${error.message}`);
  }
}

export {
  processMessage
};