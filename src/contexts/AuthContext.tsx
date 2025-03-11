import React, { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, AuthUser, AuthCredentials } from '../types/auth';
import { blockchainService } from '../services/blockchainService';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize auth state
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@auth_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to load auth state:', err);
        setError(err instanceof Error ? err : new Error('Failed to load auth state'));
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = useCallback(async (email: string, password: string, seedPhrase: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize blockchain service
      await blockchainService.initialize();
      
      // Connect wallet using seed phrase
      const walletAddress = await blockchainService.connectWallet();
      
      // Create user object
      const newUser: AuthUser = {
        id: Math.random().toString(36).substring(7), // Replace with actual user ID
        email,
        walletAddress,
        seedPhrase,
        tokenBalance: '100', // Initial bonus tokens
        status: 'active'
      };

      // Store user data
      await AsyncStorage.setItem('@auth_user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err instanceof Error ? err : new Error('Registration failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate login API call
      const storedUser = await AsyncStorage.getItem('@auth_user');
      if (!storedUser) {
        throw new Error('User not found');
      }

      const user = JSON.parse(storedUser);
      if (user.email !== email) {
        throw new Error('Invalid credentials');
      }

      // Initialize blockchain service and connect wallet
      await blockchainService.initialize();
      await blockchainService.connectWallet();

      setUser(user);
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('@auth_user');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err instanceof Error ? err : new Error('Logout failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};