
// Import necessary types from Supabase
import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Define result schema with proper typing for content (allowing null)
export const SearchResultSchema = z.object({
  id: z.string(),
  content: z.string().nullable(),
  metadata: z.any(),
  similarity: z.number()
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

// Create safe wrapper for search results
const safeParseSearchResults = (results: any[]): SearchResult[] => {
  return results.map(result => {
    try {
      return SearchResultSchema.parse(result);
    } catch (error) {
      // If parsing fails, provide a safe default
      console.error('Error parsing search result:', error);
      return {
        id: result.id || 'unknown',
        content: result.content || '',
        metadata: result.metadata || {},
        similarity: result.similarity || 0
      };
    }
  });
};

/**
 * RAG Client for embeddings search
 */
export class RagClient {
  private supabase: SupabaseClient;
  private embeddingsTable: string;

  constructor(supabase: SupabaseClient, embeddingsTable = 'embeddings') {
    this.supabase = supabase;
    this.embeddingsTable = embeddingsTable;
  }

  /**
   * Search for similar content
   */
  async search(query: string, options?: { limit?: number; threshold?: number }): Promise<SearchResult[]> {
    try {
      // Check if embeddings table exists
      const { limit = 5, threshold = 0.5 } = options || {};

      // Get embeddings for the query
      const { data: embeddings, error: embeddingsError } = await this.supabase
        .functions.invoke('get-embeddings', {
          body: { text: query },
        });

      if (embeddingsError || !embeddings?.embedding) {
        throw new Error(`Failed to get embeddings: ${embeddingsError?.message || 'Unknown error'}`);
      }

      // Search for similar content
      const { data: results, error: searchError } = await this.supabase
        .rpc('match_embeddings', {
          query_embedding: embeddings.embedding,
          match_threshold: threshold,
          match_count: limit,
        });

      if (searchError) {
        throw new Error(`Search error: ${searchError.message}`);
      }

      // Parse and return safe results
      return safeParseSearchResults(results || []);
    } catch (error) {
      console.error('RAG search error:', error);
      return [];
    }
  }

  /**
   * Get context for the RAG system
   */
  async getRagContext(query: string): Promise<string> {
    const results = await this.search(query);
    if (results.length === 0) return '';
    
    // Combine the content of all results
    return results
      .map(result => result.content)
      .filter(Boolean) // Remove null/undefined values
      .join('\n\n');
  }
}

// Export singleton instance
export const ragClient = new RagClient(null as any); // Will be initialized later
