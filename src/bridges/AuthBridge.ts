
import { AuthState } from '@/auth/auth-types/authTypes';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * AuthBridge provides a clean abstraction over authentication functionality 
 * without exposing direct access to the underlying store or provider
 */
class AuthBridgeImpl {
  getUser() {
    return useAuthStore.getState().user;
  }

  getProfile() {
    return useAuthStore.getState().profile;
  }

  isAuthenticated() {
    return useAuthStore.getState().isAuthenticated;
  }

  getStatus() {
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

  async updateUserProfile(profile: Partial<AuthState['user']>) {
    const updateProfile = useAuthStore.getState().updateProfile;
    if (updateProfile && profile) {
      await updateProfile(profile);
    }
  }
}

export const authBridge = new AuthBridgeImpl();
