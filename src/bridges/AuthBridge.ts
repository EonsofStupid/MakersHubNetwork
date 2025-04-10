
      logger.info('Logging out', {
        category: LogCategory.AUTH,
        source: 'AuthBridge',
      });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear auth store
      const store = useAuthStore.getState();
      store.setSession(null);
      
      // Publish auth event
      publishAuthEvent({ type: 'AUTH_SIGNED_OUT' });
      
      return true;
    } catch (error) {
      logger.error('Logout error', { 
        category: LogCategory.AUTH,
        source: 'AuthBridge',
        details: { error } 
      });
      
      throw error;
    }
  }
};

// Setup auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  const logger = getLogger();
  const store = useAuthStore.getState();
  
  logger.info('Auth state changed', { 
    category: LogCategory.AUTH,
    source: 'AuthBridge',
    details: { event }
  });
  
  // Handle auth state change
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    store.setSession(session);
    
    if (session?.user) {
      // Use setTimeout to avoid potential circular dependency issues
      setTimeout(() => {
        store.loadUserProfile(session.user.id);
      }, 0);
    }
  }
  
  if (event === 'SIGNED_OUT') {
    store.setSession(null);
  }
  
  // Dispatch to event system
  publishAuthEvent({
    type: 'AUTH_STATE_CHANGE',
    payload: { event, session }
  });
});
