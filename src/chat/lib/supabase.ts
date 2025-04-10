
// Mock Supabase client for chat module
// This allows the chat module to reference supabase without direct dependency
export const supabase = {
  auth: {
    signInWithPassword: async () => ({
      data: null,
      error: new Error('Not implemented in chat module')
    }),
    signOut: async () => ({
      error: null
    }),
    getSession: async () => ({
      data: { session: null }
    })
  }
};
