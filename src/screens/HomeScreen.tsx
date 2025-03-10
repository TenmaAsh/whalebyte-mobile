import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useBlockchain } from '../contexts/BlockchainContext';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { formatAddress, formatEther } from '../utils/format';

export default function HomeScreen() {
  const { account, balance, isConnected } = useBlockchain();

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Welcome to WhaleByte</Text>
          <Text style={styles.description}>
            Connect your wallet to start exploring and joining spheres.
          </Text>
          <Button
            title="Connect Wallet"
            onPress={() => navigation.navigate('Wallet')}
            style={styles.button}
          />
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Your Wallet</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{formatAddress(account || '')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Balance</Text>
            <Text style={styles.value}>{formatEther(balance?.toString() || '0')} ETH</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.title}>Quick Actions</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Create Sphere"
            onPress={() => navigation.navigate('Spheres')}
            style={styles.actionButton}
          />
          <Button
            title="Join Sphere"
            onPress={() => navigation.navigate('Spheres')}
            style={styles.actionButton}
            variant="outline"
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.title}>Recent Activity</Text>
        <Text style={styles.description}>
          Your recent sphere activity will appear here.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  card: {
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});