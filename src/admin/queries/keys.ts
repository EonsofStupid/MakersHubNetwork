
export const adminKeys = {
  content: {
    all: () => ['content'] as const,
    list: (filters?: Record<string, any>) => [...adminKeys.content.all(), { filters }] as const,
    detail: (id: string) => [...adminKeys.content.all(), id] as const,
  },
  categories: {
    all: () => ['categories'] as const,
    list: () => [...adminKeys.categories.all()] as const,
    detail: (id: string) => [...adminKeys.categories.all(), id] as const,
    tree: () => [...adminKeys.categories.all(), 'tree'] as const,
  },
} as const;
