import { DiffChange, DiffSection, DiffMetadata } from '../../types/diff';

export const createMockDiffChange = (overrides?: Partial<DiffChange>): DiffChange => ({
  value: 'test content',
  added: false,
  removed: false,
  lineNumber: 1,
  ...overrides,
});

export const createMockDiffSection = (overrides?: Partial<DiffSection>): DiffSection => ({
  id: 'test-section',
  startLine: 1,
  endLine: 10,
  type: 'context',
  isExpanded: true,
  content: [createMockDiffChange()],
  ...overrides,
});

export const createMockDiffMetadata = (overrides?: Partial<DiffMetadata>): DiffMetadata => ({
  totalAdditions: 5,
  totalDeletions: 3,
  totalModifications: 2,
  fileInfo: {
    path: 'test/file.ts',
    size: 1024,
    lastModified: new Date(),
    mimeType: 'text/typescript',
  },
  authorInfo: {
    name: 'Test User',
    email: 'test@example.com',
    timestamp: new Date(),
  },
  ...overrides,
});

export const simulateKeyboardEvent = (
  key: string,
  ctrlKey = false,
  target: Element | null = document.body
) => {
  const event = new KeyboardEvent('keydown', {
    key,
    ctrlKey,
    bubbles: true,
  });
  target?.dispatchEvent(event);
};

export const createLargeDiffContent = (lineCount: number): string => {
  return Array.from({ length: lineCount })
    .map((_, i) => `Line ${i + 1}: Some test content with modifications`)
    .join('\n');
};

export const measureRenderTime = async (callback: () => Promise<void>): Promise<number> => {
  const start = performance.now();
  await callback();
  return performance.now() - start;
};