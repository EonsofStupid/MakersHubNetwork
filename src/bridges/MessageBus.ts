
/**
 * MessageBus.ts
 * 
 * Core message bus implementation for inter-module communication
 * This provides isolation between modules while allowing controlled communication.
 */

type MessageHandler = (message: any) => void;

interface Subscription {
  id: string;
  handler: MessageHandler;
  channel: string;
}

interface ModuleInterface {
  publish: (channel: string, message: any) => void;
  subscribe: (channel: string, handler: MessageHandler) => () => void;
  unsubscribe: (id: string) => void;
}

class MessageBus {
  private subscriptions: Record<string, Subscription[]> = {};
  private moduleInterfaces: Record<string, ModuleInterface> = {};

  // Create a module-specific interface to the message bus
  public createInterface(moduleName: string): ModuleInterface {
    if (this.moduleInterfaces[moduleName]) {
      console.warn(`Module interface ${moduleName} already exists, returning existing interface`);
      return this.moduleInterfaces[moduleName];
    }

    const moduleInterface: ModuleInterface = {
      publish: (channel: string, message: any) => {
        this.publish(`${moduleName}:${channel}`, message);
      },
      subscribe: (channel: string, handler: MessageHandler) => {
        return this.subscribe(`${moduleName}:${channel}`, handler);
      },
      unsubscribe: (id: string) => {
        this.unsubscribe(id);
      }
    };

    this.moduleInterfaces[moduleName] = moduleInterface;
    return moduleInterface;
  }

  // Main message bus methods
  public publish(channel: string, message: any): void {
    if (!this.subscriptions[channel]) {
      return;
    }

    for (const subscription of this.subscriptions[channel]) {
      try {
        subscription.handler(message);
      } catch (error) {
        console.error(`Error in message handler for channel ${channel}:`, error);
      }
    }
  }

  public subscribe(channel: string, handler: MessageHandler): () => void {
    if (!this.subscriptions[channel]) {
      this.subscriptions[channel] = [];
    }

    const id = this.generateId();
    const subscription: Subscription = { id, handler, channel };
    this.subscriptions[channel].push(subscription);

    return () => this.unsubscribe(id);
  }

  public unsubscribe(id: string): void {
    for (const channel in this.subscriptions) {
      this.subscriptions[channel] = this.subscriptions[channel].filter(
        (subscription) => subscription.id !== id
      );
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

// Create a singleton instance
export const messageBus = new MessageBus();

// Helper to create a module bridge
export function createModuleBridge(moduleName: string): ModuleInterface {
  return messageBus.createInterface(moduleName);
}
