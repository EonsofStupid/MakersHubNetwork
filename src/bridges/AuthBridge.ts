
import { User, UserProfile, LogLevel, LogCategory } from '@/shared/types/shared.types';
import { useAuthStore } from '@/auth/store/auth.store';
import { logger } from '@/logging/logger.service';

/**
 * AuthBridge provides a clean abstraction over authentication functionality 
 * without exposing direct access to the underlying store or provider
 */
class AuthBridgeImpl {
  getUser(): User | null {
    return useAuthStore.getState().user;
  }

  getProfile(): UserProfile | null {
    return useAuthStore.getState().profile;
  }

  getRoles(): string[] {
    return useAuthStore.getState().roles;
  }

  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  }

  getStatus(): string {
    return useAuthStore.getState().status;
  }

  async signInWithEmail(email: string, password: string) {
    try {
      await useAuthStore.getState().login(email, password);
      return { user: this.getUser(), error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async signUp(email: string, password: string) {
    try {
      await useAuthStore.getState().signup(email, password);
      return { user: this.getUser(), error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async signOut() {
    return useAuthStore.getState().logout();
  }

  async resetPassword(email: string) {
    return useAuthStore.getState().resetPassword(email);
  }

  async updateUserProfile(profile: Partial<UserProfile>) {
    const updateProfile = useAuthStore.getState().updateProfile;
    if (updateProfile && profile) {
      await updateProfile(profile);
    }
  }
  
  // Event handling for authentication
  subscribeToEvent(event: string, callback: (event: any) => void) {
    // This is a simplified implementation
    // In a real app, this would use a proper event system
    const unsubscribe = useAuthStore.subscribe(
      state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      (newState, oldState) => {
        if (newState.isAuthenticated !== oldState.isAuthenticated) {
          callback({
            type: newState.isAuthenticated ? 'SIGNED_IN' : 'SIGNED_OUT',
            user: newState.user
          });
        }
      }
    );
    
    return { unsubscribe };
  }
  
  onAuthEvent(callback: (event: any) => void) {
    return this.subscribeToEvent('auth', callback);
  }
  
  // Session management
  async getCurrentSession() {
    const user = this.getUser();
    if (user) {
      return { user };
    }
    return null;
  }
  
  async refreshSession() {
    const user = this.getUser();
    if (user) {
      return { user_id: user.id };
    }
    return null;
  }

  // Error handling
  getError(): Error | null {
    return useAuthStore.getState().error;
  }

  // Loading state
  isLoading(): boolean {
    return useAuthStore.getState().isLoading;
  }

  // Initialization state
  isInitialized(): boolean {
    return useAuthStore.getState().initialized;
  }
}

export const AuthBridge = new AuthBridgeImpl();
