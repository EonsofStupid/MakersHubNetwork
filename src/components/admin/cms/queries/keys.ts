
export const cmsKeys = {
  content: {
    all: ['cms', 'content'] as const,
    list: () => [...cmsKeys.content.all, 'list'] as const,
    detail: (id: string) => [...cmsKeys.content.all, id] as const,
  },
  types: {
    all: ['cms', 'types'] as const,
    list: () => [...cmsKeys.types.all, 'list'] as const,
    detail: (id: string) => [...cmsKeys.types.all, id] as const,
  },
  categories: {
    all: ['cms', 'categories'] as const,
    list: () => [...cmsKeys.categories.all, 'list'] as const,
    tree: () => [...cmsKeys.categories.all, 'tree'] as const,
    detail: (id: string) => [...cmsKeys.categories.all, id] as const,
  },
  workflows: {
    all: ['cms', 'workflows'] as const,
    list: () => [...cmsKeys.workflows.all, 'list'] as const,
    detail: (id: string) => [...cmsKeys.workflows.all, id] as const,
  },
};
