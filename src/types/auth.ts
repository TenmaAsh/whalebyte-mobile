export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  walletAddress: string;
  seedPhrase?: string;
  tokenBalance: string;
  status: 'active' | 'suspended';
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  register: (email: string, password: string, seedPhrase: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface AuthCredentials {
  email: string;
  password: string;
  seedPhrase?: string;
}