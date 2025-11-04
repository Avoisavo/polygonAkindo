const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { processMessage } = require('./agent');

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