import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isConfigured } from '../firebase';
import { authService } from '../services/authService';

interface AuthContextType {
  user: any; // Use any to allow mock user
  loading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isConfigured: false });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for founder mode first
    if (authService.isFounderSession()) {
      setUser(authService.getCurrentUser());
      setLoading(false);
      return;
    }

    if (!isConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else if (authService.isFounderSession()) {
        setUser(authService.getCurrentUser());
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
