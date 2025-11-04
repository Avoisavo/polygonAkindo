import readline from 'readline';
import fetch from 'node-fetch';

// Create readline interface for terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const SERVER_URL = 'http://localhost:5000/agent';

console.log('🤖 AI Agent Terminal Chat');
console.log('📡 Connecting to server at:', SERVER_URL);
console.log('💬 Type your messages below (type "exit" to quit)\n');

// Function to send message to agent
async function sendToAgent(message) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('🤖 Agent:', data.agentResponse);
    } else {
      console.log('❌ Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('💡 Make sure server is running: npm start');
  }
}

// Function to prompt user for input
function promptUser() {
  rl.question('👤 You: ', async (input) => {
    // Check for exit command
    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      console.log('👋 Goodbye!');
      rl.close();
      return;
    }

    // Send message to agent
    if (input.trim()) {
      await sendToAgent(input);
    }

    // Prompt for next input
    console.log(''); // Empty line for spacing
    promptUser();
  });
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch('http://localhost:5000/health');
    if (response.ok) {
      console.log('✅ Server is running!\n');
      promptUser(); // Start the chat
    } else {
      throw new Error('Server not responding');
    }
  } catch (error) {
    console.log('❌ Cannot connect to server');
    console.log('💡 Please start the server first: npm start');
    console.log('🔄 Then run this script again\n');
    rl.close();
  }
}

// Start the application
checkServer();