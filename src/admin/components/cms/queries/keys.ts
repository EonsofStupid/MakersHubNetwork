
export const cmsKeys = {
  all: ['cms'] as const,
  types: {
    all: () => [...cmsKeys.all, 'types'] as const,
    list: () => [...cmsKeys.types.all()] as const,
    detail: (id: string) => [...cmsKeys.types.all(), id] as const,
  },
  content: {
    all: () => [...cmsKeys.all, 'content'] as const,
    list: (filters?: Record<string, any>) => [...cmsKeys.content.all(), { filters }] as const,
    detail: (id: string) => [...cmsKeys.content.all(), id] as const,
  },
  categories: {
    all: () => [...cmsKeys.all, 'categories'] as const,
    list: () => [...cmsKeys.categories.all()] as const,
    detail: (id: string) => [...cmsKeys.categories.all(), id] as const,
    tree: () => [...cmsKeys.categories.all(), 'tree'] as const,
  },
} as const;
