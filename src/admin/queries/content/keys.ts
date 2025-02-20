
export const adminKeys = {
  all: ['admin'] as const,
  types: {
    all: () => [...adminKeys.all, 'types'] as const,
    list: () => [...adminKeys.types.all()] as const,
    detail: (id: string) => [...adminKeys.types.all(), id] as const,
  },
  content: {
    all: () => [...adminKeys.all, 'content'] as const,
    list: (filters?: Record<string, any>) => [...adminKeys.content.all(), { filters }] as const,
    detail: (id: string) => [...adminKeys.content.all(), id] as const,
  },
  categories: {
    all: () => [...adminKeys.all, 'categories'] as const,
    list: () => [...adminKeys.categories.all()] as const,
    detail: (id: string) => [...adminKeys.categories.all(), id] as const,
    tree: () => [...adminKeys.categories.all(), 'tree'] as const,
  },
} as const;
