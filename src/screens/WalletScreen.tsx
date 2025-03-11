import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useToken } from '../contexts/TokenContext';
import { TokenBalanceCard } from '../components/tokens/TokenBalanceCard';
import { SendTokenModal } from '../components/tokens/SendTokenModal';

export const WalletScreen: React.FC = () => {
  const { isConnected, connectWallet } = useBlockchain();
  const { transactions, isLoading, refreshTransactions } = useToken();
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  }, [refreshTransactions]);

  const renderTransactionItem = (transaction: any) => {
    const isReceive = transaction.type === 'receive';
    return (
      <View key={transaction.id} style={styles.transactionItem}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>
            {isReceive ? 'Received' : 'Sent'} {transaction.symbol}
          </Text>
          <Text style={styles.transactionDetails}>
            {isReceive ? 'From: ' : 'To: '}
            {isReceive ? transaction.fromAddress : transaction.toAddress}
          </Text>
          <Text style={styles.transactionDate}>
            {new Date(transaction.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text
            style={[
              styles.amountText,
              { color: isReceive ? '#4CAF50' : '#F44336' },
            ]}
          >
            {isReceive ? '+' : '-'}{transaction.amount} {transaction.symbol}
          </Text>
          <Text style={styles.statusText}>{transaction.status}</Text>
        </View>
      </View>
    );
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <View style={styles.connectContainer}>
          <Text style={styles.connectText}>
            Connect your wallet to view balance and transactions
          </Text>
          <TouchableOpacity style={styles.connectButton} onPress={connectWallet}>
            <Text style={styles.connectButtonText}>Connect Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TokenBalanceCard />
      
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => setSendModalVisible(true)}
      >
        <Text style={styles.sendButtonText}>Send Tokens</Text>
      </TouchableOpacity>

      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {transactions.map(renderTransactionItem)}
          </ScrollView>
        )}
      </View>

      <SendTokenModal
        visible={sendModalVisible}
        onClose={() => setSendModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  connectText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666',
  },
  connectButton: {
    backgroundColor: '#0000ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: '#0000ff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDetails: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
    textTransform: 'capitalize',
  },
});