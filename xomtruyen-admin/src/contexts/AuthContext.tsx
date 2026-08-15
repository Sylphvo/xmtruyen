import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          // Check expiration
          if (decoded.exp * 1000 < Date.now()) {
            throw new Error('Token expired');
          }
          
          setIsAuthenticated(true);
          setUser({
            id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.sub || '',
            email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded.email || '',
            name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name || '',
            role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || 'User',
          });
        } catch (error) {
          console.error('Failed to decode token:', error);
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, refreshToken: string) => {
    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('refreshToken', refreshToken);
    
    try {
      const decoded: any = jwtDecode(token);
      setIsAuthenticated(true);
      setUser({
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.sub || '',
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded.email || '',
        name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name || '',
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || 'User',
      });
    } catch (error) {
      console.error('Failed to set user on login:', error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
