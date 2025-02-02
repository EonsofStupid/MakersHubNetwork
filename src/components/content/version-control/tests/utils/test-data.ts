export const sampleDiffContent = {
  old: `function hello() {
  console.log("Hello");
  return true;
}`,
  new: `function hello() {
  console.log("Hello, World!");
  const result = true;
  return result;
}`,
};

export const sampleDiffMetadata = {
  created_at: '2024-03-20T10:00:00Z',
  created_by: 'Test User',
  version_number: 2,
  change_summary: 'Updated greeting and return statement',
};

export const largeDiffContent = {
  old: Array.from({ length: 1000 })
    .map((_, i) => `Line ${i + 1}: Original content`)
    .join('\n'),
  new: Array.from({ length: 1000 })
    .map((_, i) => `Line ${i + 1}: ${i % 3 === 0 ? 'Modified' : 'Original'} content`)
    .join('\n'),
};

export const keyboardTestScenarios = [
  { key: 'f', ctrlKey: true, expectedAction: 'openSearch' },
  { key: 'p', ctrlKey: true, expectedAction: 'previousDiff' },
  { key: 'n', ctrlKey: true, expectedAction: 'nextDiff' },
  { key: 'Escape', ctrlKey: false, expectedAction: 'closeSearch' },
];