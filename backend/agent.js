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
      
      // Log if payment was made
      if (functionResult.paymentMade) {
        console.log('💰 Payment was made during function execution');
        console.log('   Price:', functionResult.paymentPrice);
        console.log('   TX:', functionResult.paymentTx);
      }
      
      // Add function call and result to conversation
      messages.push(responseMessage);
      messages.push({
        role: "function",
        name: functionName,
        content: JSON.stringify(functionResult)
      });
      
      // Get final response from AI after function execution
      // Include payment info in the system message if payment was made
      if (functionResult.paymentMade) {
        const explorerLink = `https://amoy.polygonscan.com/tx/${functionResult.paymentTx}`;
        messages.push({
          role: "system",
          content: `Note: A payment of ${functionResult.paymentPrice} was automatically made for this request. Transaction hash: ${functionResult.paymentTx}. Explorer link: ${explorerLink}. Make sure to mention both the payment amount and provide the explorer link to the user so they can view the transaction.`
        });
      }
      
      const finalCompletion = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      });
      
      const finalResponse = finalCompletion.choices[0].message.content;
      console.log('🧠 Agent response with function result generated');
      
      // Return response with payment metadata
      return {
        message: finalResponse,
        paymentInfo: functionResult.paymentMade ? {
          paid: true,
          amount: functionResult.paymentPrice,
          txHash: functionResult.paymentTx,
          explorerLink: `https://amoy.polygonscan.com/tx/${functionResult.paymentTx}`,
          agentWallet: functionResult.agentWallet
        } : null
      };
    } else {
      // No function call needed, return direct response
      const response = responseMessage.content;
      console.log('🧠 Agent response generated');
      
      return {
        message: response,
        paymentInfo: null
      };
    }
  } catch (error) {
    console.error('❌ Error in agent processing:', error.message);
    throw new Error(`AI Agent Error: ${error.message}`);
  }
}

export {
  processMessage
};