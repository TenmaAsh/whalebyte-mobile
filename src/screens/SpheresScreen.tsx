import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useSpheres } from '../hooks/useSpheres';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CreateSphereModal } from '../components/modals/CreateSphereModal';
import { formatEther } from '../utils/format';

export default function SpheresScreen() {
  const navigation = useNavigation();
  const { isConnected } = useBlockchain();
  const { mySpheres, joinedSpheres, availableSpheres, isLoading, refresh } = useSpheres();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSpherePress = (sphere) => {
    navigation.navigate('SphereDetails', { sphere });
  };

  const renderSphereCard = (sphere, type) => (
    <Pressable
      key={sphere.id}
      onPress={() => handleSpherePress(sphere)}
      style={({ pressed }) => [
        styles.sphereCard,
        pressed && styles.sphereCardPressed,
      ]}
    >
      <Card>
        <View style={styles.sphereHeader}>
          <Text style={styles.sphereName}>{sphere.name}</Text>
          <View style={styles.badgeContainer}>
            {sphere.isPremium && (
              <Badge
                label="Premium"
                color="#f59e0b"
                icon="star"
              />
            )}
            {type === 'my' && (
              <Badge
                label="Creator"
                color="#2563eb"
                icon="create"
              />
            )}
            {type === 'joined' && (
              <Badge
                label="Member"
                color="#10b981"
                icon="people"
              />
            )}
          </View>
        </View>

        <Text style={styles.sphereDescription} numberOfLines={2}>
          {sphere.description}
        </Text>

        <View style={styles.sphereFooter}>
          <View style={styles.sphereStats}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.statsText}>{sphere.memberCount}</Text>
          </View>
          {sphere.isPremium && (
            <View style={styles.sphereStats}>
              <Ionicons name="wallet-outline" size={16} color="#666" />
              <Text style={styles.statsText}>
                {formatEther(sphere.entryFee)} ETH
              </Text>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Card style={styles.connectCard}>
          <Text style={styles.title}>Connect Your Wallet</Text>
          <Text style={styles.description}>
            Connect your wallet to view and join spheres.
          </Text>
          <Button
            title="Go to Wallet"
            onPress={() => navigation.navigate('Wallet')}
          />
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spheres</Text>
        <Button
          title="Create New"
          onPress={() => setShowCreateModal(true)}
          icon="add-circle-outline"
        />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} />
        }
      >
        {mySpheres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Spheres</Text>
            {mySpheres.map(sphere => renderSphereCard(sphere, 'my'))}
          </View>
        )}

        {joinedSpheres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Joined Spheres</Text>
            {joinedSpheres.map(sphere => renderSphereCard(sphere, 'joined'))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Spheres</Text>
          {availableSpheres.length > 0 ? (
            availableSpheres.map(sphere => renderSphereCard(sphere, 'available'))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No spheres available to join</Text>
            </Card>
          )}
        </View>
      </ScrollView>

      <CreateSphereModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          refresh();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sphereCard: {
    marginBottom: 12,
  },
  sphereCardPressed: {
    opacity: 0.7,
  },
  sphereHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sphereName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sphereDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  sphereFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sphereStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  connectCard: {
    margin: 16,
    padding: 16,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 12,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});