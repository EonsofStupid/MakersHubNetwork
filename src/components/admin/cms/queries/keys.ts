export const cmsKeys = {
  all: ['cms'] as const,
  types: {
    all: () => [...cmsKeys.all, 'types'] as const,
    list: () => [...cmsKeys.types.all()] as const,
    detail: (id: string) => [...cmsKeys.types.all(), id] as const,
  },
  content: {
    all: ['cms', 'content'] as const,
    list: (filter: any) => ['cms', 'content', 'list', filter] as const,
    detail: (id: string) => ['cms', 'content', 'detail', id] as const,
  },
  contentTypes: {
    all: ['cms', 'contentTypes'] as const,
  },
  categories: {
    all: ['cms', 'categories'] as const,
    list: () => ['cms', 'categories', 'list'] as const,
    detail: (id: string) => ['cms', 'categories', 'detail', id] as const,
    tree: () => ['cms', 'categories', 'tree'] as const,
  },
  workflows: {
    all: ['cms', 'workflows'] as const,
    list: () => ['cms', 'workflows', 'list'] as const,
    detail: (id: string) => ['cms', 'workflows', 'detail', id] as const,
  },
} as const;
