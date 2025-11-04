/**
 * API service layer for backend communication
 * Handles all HTTP requests to the backend server
 */

import type { AgentRequest, AgentResponse, AgentError } from './types';

// Base API URL - can be configured via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

/**
 * Send a message to the AI agent
 * @param message - The user's message to send to the agent
 * @returns The agent's response (string or payment request object)
 * @throws Error if the request fails
 */
export async function sendMessageToAgent(message: string): Promise<string | any> {
  try {
    const requestBody: AgentRequest = { message };
    
    console.log('🔍 API_BASE_URL:', API_BASE_URL);
    console.log('🔍 Full URL:', `${API_BASE_URL}/agent`);
    console.log('🔍 Request body:', requestBody);
    
    const response = await fetch(`${API_BASE_URL}/agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AgentResponse | AgentError = await response.json();

    if (data.success && 'agentResponse' in data) {
      // Check if agentResponse is a payment request object
      if (typeof data.agentResponse === 'object' && data.agentResponse !== null) {
        return data.agentResponse;
      }
      return data.agentResponse;
    } else if ('error' in data) {
      throw new Error(data.error);
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('❌ Full error object:', error);
    console.error('❌ Error type:', typeof error);
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      throw new Error(`Failed to send message: ${error.message}`);
    }
    throw new Error('Failed to send message: Unknown error');
  }
}

/**
 * Check backend server health
 * @returns true if server is healthy, false otherwise
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}
