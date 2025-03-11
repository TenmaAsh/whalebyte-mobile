export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
}

export interface TokenTransaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  symbol: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'send' | 'receive' | 'appreciation';
}

export interface TokenTransfer {
  toAddress: string;
  amount: string;
  symbol: string;
}

export interface TokenContextType {
  balances: TokenBalance[];
  transactions: TokenTransaction[];
  isLoading: boolean;
  error: string | null;
  
  // Token operations
  loadBalances: () => Promise<void>;
  loadTransactions: () => Promise<void>;
  transferTokens: (transfer: TokenTransfer) => Promise<void>;
  appreciatePost: (postId: string, amount: string) => Promise<void>;
  
  // Refresh functions
  refreshBalances: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}