
/**
 * Get initials from a name or email string
 * @param input Name or email to extract initials from
 * @param maxChars Maximum number of characters to return (default: 2)
 * @returns Uppercase initials
 */
export function getInitials(input: string, maxChars = 2): string {
  if (!input) return '?';

  // For email addresses, use the first part before the @
  if (input.includes('@')) {
    input = input.split('@')[0];
  }

  // Split by spaces, dashes, underscores, dots
  const parts = input.split(/[\s\-_\.]+/).filter(Boolean);
  
  if (parts.length === 0) return '?';
  
  if (parts.length === 1) {
    // Single word: use first 1-2 characters
    return input.substring(0, maxChars).toUpperCase();
  }
  
  // Multiple words: use first character of each word (up to maxChars)
  return parts
    .slice(0, maxChars)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}
