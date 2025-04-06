/**
 * Retrieval Augmented Generation (RAG) client
 * This module handles the retrieval of relevant context for chat messages
 * by querying project-specific knowledge bases using both flat file and vector database approaches
 */

import { supabase } from "@/integrations/supabase/client";

// Interface for RAG source configuration
interface RagSource {
  type: 'flatfile' | 'pgvector';
  priority: number; // Higher numbers take precedence
}

// RAG source configuration
const ragSources: Record<string, RagSource> = {
  'flatfile': { type: 'flatfile', priority: 1 },
  'pgvector': { type: 'pgvector', priority: 2 }
};

// Default RAG source
const defaultRagSource: RagSource = { type: 'flatfile', priority: 1 };

/**
 * Gets the relevant context for the chat based on project ID and query
 * Uses Retrieval Augmented Generation to enhance responses with project-specific information
 * Supports both flat file and pgvector retrieval methods
 * 
 * @param projectId - The unique identifier for the current project
 * @param query - The user's message to get context for (optional)
 * @returns Promise with the RAG context string
 */
export async function getRagContext(projectId: string, query?: string): Promise<string> {
  console.log(`Retrieving RAG context for project ${projectId}`, query ? `with query: ${query}` : '');
  
  try {
    // Determine which RAG source to use based on configuration
    // If pgvector is available and configured, use it
    // Otherwise, fall back to flat file approach
    const ragSource = await determineRagSource(projectId);
    console.log(`Using RAG source: ${ragSource.type}`);
    
    if (ragSource.type === 'pgvector') {
      return await getPgVectorContext(projectId, query);
    } else {
      return await getFlatFileContext(projectId, query);
    }
  } catch (error) {
    console.error('Error retrieving RAG context:', error);
    return 'Unable to retrieve context information. Proceeding with general knowledge.';
  }
}

/**
 * Determines which RAG source to use based on availability and configuration
 */
async function determineRagSource(projectId: string): Promise<RagSource> {
  // Check if pgvector is available for this project
  const isPgVectorAvailable = await checkPgVectorAvailability(projectId);
  
  if (isPgVectorAvailable) {
    return ragSources.pgvector;
  }
  
  // Fallback to flat file
  return ragSources.flatfile;
}

/**
 * Checks if pgvector is available for the given project
 */
async function checkPgVectorAvailability(projectId: string): Promise<boolean> {
  try {
    // Check if the embeddings table exists in Supabase
    const { error } = await supabase
      .from('project_embeddings')
      .select('id')
      .limit(1);
    
    // If no error, pgvector is available
    return !error;
  } catch (e) {
    console.log('PgVector not available:', e);
    return false;
  }
}

/**
 * Gets context using pgvector semantic search
 */
async function getPgVectorContext(projectId: string, query?: string): Promise<string> {
  if (!query) {
    // If no query provided, return basic project information
    return getProjectSpecificContext(projectId);
  }
  
  try {
    console.log('Querying pgvector for context');
    // In production, this would:
    // 1. Generate embedding for the query using an embedding model
    // 2. Perform vector search in the database using pgvector
    // 3. Return the most relevant documents
    
    // Simulate API delay for development
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Placeholder for actual pgvector implementation
    return `Project ${projectId} context from pgvector: This would contain semantic search results based on the query "${query}".`;
  } catch (error) {
    console.error('Error retrieving pgvector context:', error);
    // Fall back to flat file approach
    return getFlatFileContext(projectId, query);
  }
}

/**
 * Gets context using flat file approach (basic keyword matching)
 */
async function getFlatFileContext(projectId: string, query?: string): Promise<string> {
  // Simulate API delay for development
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get basic project context
  const baseContext = getProjectSpecificContext(projectId);
  
  if (!query) {
    return baseContext;
  }
  
  // Basic keyword matching for query-specific context
  // In a real implementation, this would use more sophisticated retrieval
  const keywords = query.toLowerCase().split(' ');
  const contextKeywords = {
    'react': 'React is a JavaScript library for building user interfaces.',
    'typescript': 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
    'database': 'This project uses a database for data persistence.',
    'api': 'The project includes API integration for external services.',
    'user': 'User authentication and management features are available.',
    'style': 'The project uses CSS and styling libraries for presentation.',
    'bug': 'Common bugs include type errors and state management issues.',
    'error': 'Error handling is implemented throughout the codebase.'
  };
  
  // Find matching context based on keywords
  const matchedContexts = keywords
    .filter(keyword => contextKeywords[keyword])
    .map(keyword => contextKeywords[keyword]);
  
  if (matchedContexts.length > 0) {
    return `${baseContext}\n\nQuery-specific context:\n${matchedContexts.join('\n')}`;
  }
  
  return baseContext;
}

/**
 * Helper function to get project-specific context
 */
function getProjectSpecificContext(projectId: string): string {
  // In production, this would be replaced with actual project data retrieval
  
  // Simple project context examples for demonstration
  const projectContexts: Record<string, string> = {
    'default': `Project context: This is a general web application.`,
    'web-app': `Project context: This is a web application with React frontend and Node.js backend.`,
    'mobile-app': `Project context: This is a mobile application built with React Native.`,
    'e-commerce': `Project context: This is an e-commerce platform with product catalog and checkout system.`,
    'blog': `Project context: This is a blog platform with articles and commenting system.`
  };
  
  return projectContexts[projectId] || projectContexts['default'];
}
