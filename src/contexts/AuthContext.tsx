import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isImobiliaria: boolean;
  setIsImobiliaria: (value: boolean) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isImobiliaria, setIsImobiliaria] = useState(false);

  const signOut = () => {
    setUser(null);
    setIsImobiliaria(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isImobiliaria, setIsImobiliaria, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 