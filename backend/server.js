import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { processMessage } from './agent.js';
import { getPendingPayment, markPaymentCompleted, retryWithPayment } from './clients/payment-handler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Agent Server is running!',
    endpoints: {
      agent: 'POST /agent - Send message to AI agent'
    }
  });
});

// Main agent endpoint
app.post('/agent', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Validate input
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        example: { message: 'Hello, AI agent!' }
      });
    }

    console.log('📥 Received message:', message);
    
    // Send to AI agent brain
    const agentResponse = await processMessage(message);
    
    console.log('📤 Sending response back');
    
    // Send response back
    res.json({
      success: true,
      userMessage: message,
      agentResponse: agentResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Payment completion endpoint
app.post('/payment/complete', async (req, res) => {
  try {
    const { paymentId, txHash, url } = req.body;
    
    if (!paymentId || !txHash || !url) {
      return res.status(400).json({
        error: 'Missing required fields: paymentId, txHash, url'
      });
    }
    
    // Verify payment exists
    const payment = getPendingPayment(paymentId);
    if (!payment) {
      return res.status(404).json({
        error: 'Payment not found or expired'
      });
    }
    
    console.log('💰 Processing payment completion:', { paymentId, txHash });
    
    // Mark payment as completed
    markPaymentCompleted(paymentId, txHash);
    
    // Retry fetching the content with payment proof
    try {
      const scrapedContent = await retryWithPayment(url, txHash);
      
      if (scrapedContent.success) {
        console.log('✅ Content retrieved successfully after payment');
        
        res.json({
          success: true,
          message: 'Payment verified, content retrieved',
          paymentId: paymentId,
          txHash: txHash,
          contentRetrieved: true,
          content: {
            title: scrapedContent.title,
            preview: scrapedContent.content,
            url: scrapedContent.url
          }
        });
      } else {
        throw new Error('Failed to retrieve content');
      }
    } catch (error) {
      console.error('Failed to retrieve content after payment:', error.message);
      res.json({
        success: true,
        message: 'Payment recorded, but content retrieval failed',
        paymentId: paymentId,
        txHash: txHash,
        contentRetrieved: false,
        error: error.message
      });
    }
    
  } catch (error) {
    console.error('❌ Payment completion error:', error.message);
    res.status(500).json({
      error: 'Failed to process payment',
      details: error.message
    });
  }
});

// Get payment status endpoint
app.get('/payment/:paymentId', (req, res) => {
  const { paymentId } = req.params;
  const payment = getPendingPayment(paymentId);
  
  if (!payment) {
    return res.status(404).json({
      error: 'Payment not found'
    });
  }
  
  res.json({
    success: true,
    payment: payment
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Agent server running on port ${PORT}`);
  console.log(`📡 Test endpoint: http://localhost:${PORT}/agent`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});