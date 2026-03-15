import { auth } from '../firebase';

export const authService = {
  /**
   * Get the current user ID, handling founder mode
   */
  getCurrentUid(): string | null {
    // Check for founder mode in localStorage
    const isFounder = localStorage.getItem('caterpro_is_founder') === 'true';
    
    if (isFounder) {
      return 'FOUNDER_ADMIN';
    }
    
    return auth?.currentUser?.uid || null;
  },

  /**
   * Get the current user object or mock founder user
   */
  getCurrentUser() {
    const isFounder = localStorage.getItem('caterpro_is_founder') === 'true';
    
    if (isFounder) {
      return {
        uid: 'FOUNDER_ADMIN',
        displayName: 'Founder Admin',
        email: 'founder@caterproai.com',
        isFounder: true
      };
    }
    
    return auth?.currentUser || null;
  },

  /**
   * Check if the current session is a founder session
   */
  isFounderSession(): boolean {
    return localStorage.getItem('caterpro_is_founder') === 'true';
  }
};
