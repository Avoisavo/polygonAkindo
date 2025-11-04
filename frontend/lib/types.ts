/**
 * Shared TypeScript types for API requests and responses
 */

export interface AgentRequest {
  message: string;
}

export interface AgentResponse {
  success: boolean;
  userMessage: string;
  agentResponse: string;
  timestamp: string;
}

export interface AgentError {
  success: false;
  error: string;
  details?: string;
}
