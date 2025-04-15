
// Chat types
export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  participants: string[];
}
