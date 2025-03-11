import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { ethers } from 'ethers';
import { useBlockchain } from './BlockchainContext';
import { TokenBalance, TokenTransaction, TokenTransfer, TokenContextType } from '../types/token';

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { provider, signer, isConnected } = useBlockchain();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBalances = useCallback(async () => {
    if (!isConnected || !provider || !signer) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Example: Load native token balance
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      
      // In a real implementation, you would:
      // 1. Load balances for all supported tokens
      // 2. Use token contract ABIs to get ERC20 balances
      // 3. Format balances according to token decimals

      setBalances([
        {
          address: 'native',
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethers.formatEther(balance),
          decimals: 18
        }
      ]);
    } catch (err) {
      setError('Failed to load balances');
      console.error('Error loading balances:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, provider, signer]);

  const loadTransactions = useCallback(async () => {
    if (!isConnected || !signer) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, you would:
      // 1. Query transaction history from your backend or blockchain
      // 2. Format transactions with proper types and statuses
      // 3. Include appreciation transactions

      // Mock implementation
      const address = await signer.getAddress();
      const mockTransactions: TokenTransaction[] = [
        {
          id: '1',
          fromAddress: address,
          toAddress: '0x1234...5678',
          amount: '0.1',
          symbol: 'ETH',
          timestamp: Date.now(),
          status: 'completed',
          type: 'send'
        }
      ];

      setTransactions(mockTransactions);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Error loading transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, signer]);

  const transferTokens = useCallback(async (transfer: TokenTransfer) => {
    if (!isConnected || !signer) {
      Alert.alert('Error', 'Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation:
      // 1. Validate transfer parameters
      // 2. Check balance sufficiency
      // 3. Execute transfer using appropriate contract
      // 4. Wait for transaction confirmation
      // 5. Update balances and transactions

      const tx = await signer.sendTransaction({
        to: transfer.toAddress,
        value: ethers.parseEther(transfer.amount)
      });

      await tx.wait();
      
      // Refresh balances and transactions
      await loadBalances();
      await loadTransactions();

      Alert.alert('Success', 'Transfer completed successfully');
    } catch (err) {
      setError('Transfer failed');
      Alert.alert('Error', 'Failed to transfer tokens');
      console.error('Error transferring tokens:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, signer, loadBalances, loadTransactions]);

  const appreciatePost = useCallback(async (postId: string, amount: string) => {
    if (!isConnected || !signer) {
      Alert.alert('Error', 'Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation:
      // 1. Call appreciation contract
      // 2. Wait for transaction confirmation
      // 3. Update post appreciation count
      // 4. Update balances and transactions

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Post appreciated successfully');
      await loadBalances();
      await loadTransactions();
    } catch (err) {
      setError('Appreciation failed');
      Alert.alert('Error', 'Failed to appreciate post');
      console.error('Error appreciating post:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, signer, loadBalances, loadTransactions]);

  const refreshBalances = useCallback(async () => {
    await loadBalances();
  }, [loadBalances]);

  const refreshTransactions = useCallback(async () => {
    await loadTransactions();
  }, [loadTransactions]);

  // Load initial data
  React.useEffect(() => {
    if (isConnected) {
      loadBalances();
      loadTransactions();
    }
  }, [isConnected, loadBalances, loadTransactions]);

  const value: TokenContextType = {
    balances,
    transactions,
    isLoading,
    error,
    loadBalances,
    loadTransactions,
    transferTokens,
    appreciatePost,
    refreshBalances,
    refreshTransactions
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};