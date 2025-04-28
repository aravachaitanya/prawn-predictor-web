
import React, { createContext, useState, useEffect } from 'react';
import { AuthService } from '@/services/authService';

interface User {
  email?: string;
  phone?: string;
  displayName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check if the user is already logged in
    const authStatus = AuthService.isAuthenticated();
    const userData = AuthService.getUser();
    
    if (authStatus && userData) {
      setIsAuthenticated(true);
      setUser(userData);
    }
  }, []);
  
  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    AuthService.login(userData);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    AuthService.logout();
  };
  
  const value = {
    isAuthenticated,
    user,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
