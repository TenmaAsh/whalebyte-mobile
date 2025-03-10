import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBlockchain } from '../contexts/BlockchainContext';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { formatAddress, formatEther } from '../utils/format';

export default function WalletScreen() {
  const { account, balance, isConnected, isLoading, connect, disconnect, claimWelcomeBonus } = useBlockchain();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleClaimBonus = async () => {
    try {
      await claimWelcomeBonus();
    } catch (error) {
      console.error('Failed to claim bonus:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Connecting to wallet...</Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet-outline" size={48} color="#2563eb" />
          </View>
          <Text style={styles.title}>Connect Your Wallet</Text>
          <Text style={styles.description}>
            Connect your wallet to start exploring and joining spheres. You'll need a wallet to:
          </Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="create-outline" size={24} color="#2563eb" />
              <Text style={styles.featureText}>Create your own spheres</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="people-outline" size={24} color="#2563eb" />
              <Text style={styles.featureText}>Join existing spheres</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="star-outline" size={24} color="#2563eb" />
              <Text style={styles.featureText}>Access premium features</Text>
            </View>
          </View>
          <Button
            title="Connect Wallet"
            onPress={handleConnect}
            style={styles.button}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.subtitle}>New to Web3?</Text>
          <Text style={styles.description}>
            Get started with a simulator wallet to test the app's features.
          </Text>
          <Button
            title="Use Simulator"
            onPress={() => {}}
            variant="outline"
            style={styles.button}
          />
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.walletHeader}>
          <View>
            <Text style={styles.title}>Your Wallet</Text>
            <Text style={styles.address}>{formatAddress(account || '')}</Text>
          </View>
          <Button
            title="Disconnect"
            onPress={handleDisconnect}
            variant="outline"
            size="small"
          />
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceValue}>
            {formatEther(balance?.toString() || '0')} ETH
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Spheres Created</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Spheres Joined</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.subtitle}>Welcome Bonus</Text>
        <Text style={styles.description}>
          Claim your welcome bonus to get started with creating and joining spheres.
        </Text>
        <Button
          title="Claim Bonus"
          onPress={handleClaimBonus}
          style={styles.button}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  card: {
    margin: 16,
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  featureList: {
    marginVertical: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 8,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  address: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  balanceContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
  },
});