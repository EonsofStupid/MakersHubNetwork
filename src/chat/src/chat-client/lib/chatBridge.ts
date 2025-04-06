
import { ChatBridge } from '../types';

export function useChatBridge(): ChatBridge {
  return {
    userId: "stub-user-id",
    printerContext: { name: "Example Printer", settings: {} },
    projectContext: { id: "project-abc", title: "Printer Build" }
  };
}
