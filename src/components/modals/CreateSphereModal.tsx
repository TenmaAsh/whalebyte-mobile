import React, { useState } from 'react';
import { View, Modal, StyleSheet, TextInput, Switch, ScrollView } from 'react-native';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ethers } from 'ethers';

interface CreateSphereModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateSphereModal({ visible, onClose, onSuccess }: CreateSphereModalProps) {
  const { createSphere } = useBlockchain();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [entryFee, setEntryFee] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !description) {
      return;
    }

    setIsLoading(true);
    try {
      await createSphere({
        name,
        description,
        isPremium,
        entryFee: isPremium ? ethers.parseEther(entryFee).toString() : '0',
        categories: [],
        rules: [],
      });
      onSuccess();
      resetForm();
    } catch (error) {
      console.error('Failed to create sphere:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIsPremium(false);
    setEntryFee('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalContent}>
          <ScrollView>
            <Text variant="title" style={styles.title}>Create New Sphere</Text>

            <View style={styles.inputGroup}>
              <Text variant="label">Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter sphere name"
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text variant="label">Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter sphere description"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            <View style={styles.switchContainer}>
              <Text variant="label">Premium Sphere</Text>
              <Switch
                value={isPremium}
                onValueChange={setIsPremium}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={isPremium ? '#2563eb' : '#f4f4f5'}
              />
            </View>

            {isPremium && (
              <View style={styles.inputGroup}>
                <Text variant="label">Entry Fee (ETH)</Text>
                <TextInput
                  style={styles.input}
                  value={entryFee}
                  onChangeText={setEntryFee}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={onClose}
                variant="outline"
                style={styles.button}
              />
              <Button
                title="Create"
                onPress={handleCreate}
                loading={isLoading}
                disabled={!name || !description || (isPremium && !entryFee)}
                style={styles.button}
              />
            </View>
          </ScrollView>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    maxHeight: '80%',
  },
  title: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 4,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  button: {
    minWidth: 100,
  },
});