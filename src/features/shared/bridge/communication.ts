
import { create } from 'zustand';

// Message types for communication between admin and feature components
export type MessageType = 'FEATURE_DATA' | 'FEATURE_EVENT' | 'ADMIN_COMMAND' | 'ADMIN_DATA';

export interface Message<T = any> {
  type: MessageType;
  source: 'feature' | 'admin';
  target?: string;
  payload: T;
  timestamp: number;
}

type Subscriber = (message: Message) => void;

interface CommunicationState {
  messages: Message[];
  subscribers: Map<string, Set<Subscriber>>;
  
  // Actions
  publish: <T>(channel: string, message: Omit<Message<T>, 'timestamp'>) => void;
  subscribe: (channel: string, callback: Subscriber) => () => void;
}

// Create a Zustand store for the communication bridge
export const useCommunicationBridge = create<CommunicationState>((set, get) => ({
  messages: [],
  subscribers: new Map(),
  
  // Publish a message to a channel
  publish: (channel, message) => {
    const fullMessage: Message = {
      ...message,
      timestamp: Date.now()
    };
    
    // Store message in history
    set((state) => ({
      messages: [...state.messages.slice(-99), fullMessage]
    }));
    
    // Notify subscribers
    const subscribers = get().subscribers.get(channel);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(fullMessage);
        } catch (error) {
          console.error(`Error notifying subscriber for channel ${channel}:`, error);
        }
      });
    }
  },
  
  // Subscribe to a channel
  subscribe: (channel, callback) => {
    const { subscribers } = get();
    
    // Create channel if it doesn't exist
    if (!subscribers.has(channel)) {
      subscribers.set(channel, new Set());
    }
    
    // Add the subscriber
    const channelSubscribers = subscribers.get(channel)!;
    channelSubscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      const currentSubscribers = get().subscribers.get(channel);
      if (currentSubscribers) {
        currentSubscribers.delete(callback);
      }
    };
  }
}));

// React hook for using the communication bridge
export function useBridgeSubscription(channel: string, callback: Subscriber) {
  React.useEffect(() => {
    const unsubscribe = useCommunicationBridge.getState().subscribe(channel, callback);
    return unsubscribe;
  }, [channel, callback]);
}

// Helper to publish feature events to admin
export function publishFeatureEvent<T>(feature: string, eventType: string, data: T) {
  useCommunicationBridge.getState().publish('feature-events', {
    type: 'FEATURE_EVENT',
    source: 'feature',
    target: 'admin',
    payload: {
      feature,
      eventType,
      data
    }
  });
}

// Helper to publish admin commands to features
export function publishAdminCommand<T>(feature: string, command: string, data: T) {
  useCommunicationBridge.getState().publish(`admin-${feature}`, {
    type: 'ADMIN_COMMAND',
    source: 'admin',
    target: feature,
    payload: {
      command,
      data
    }
  });
}
