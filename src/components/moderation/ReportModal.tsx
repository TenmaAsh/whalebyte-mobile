import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useModeration } from '../../contexts/ModerationContext';
import { ReportReason } from '../../types/moderation';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
}

const REPORT_REASONS: { label: string; value: ReportReason }[] = [
  { label: 'Spam', value: 'spam' },
  { label: 'Harassment', value: 'harassment' },
  { label: 'Inappropriate Content', value: 'inappropriate_content' },
  { label: 'Hate Speech', value: 'hate_speech' },
  { label: 'Misinformation', value: 'misinformation' },
  { label: 'Copyright Violation', value: 'copyright' },
  { label: 'Other', value: 'other' },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  postId,
}) => {
  const { createReport, isLoading } = useModeration();
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!selectedReason) {
      return;
    }

    try {
      await createReport(postId, selectedReason, description);
      setSelectedReason(null);
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Report Content</Text>

          <ScrollView style={styles.reasonsContainer}>
            {REPORT_REASONS.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.reasonButton,
                  selectedReason === value && styles.selectedReason,
                ]}
                onPress={() => setSelectedReason(value)}
              >
                <Text
                  style={[
                    styles.reasonText,
                    selectedReason === value && styles.selectedReasonText,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Additional Details</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Please provide more details about your report..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                (!selectedReason || isLoading) && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={!selectedReason || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Submit Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  reasonsContainer: {
    maxHeight: 200,
    marginBottom: 16,
  },
  reasonButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedReason: {
    backgroundColor: '#0000ff',
  },
  reasonText: {
    fontSize: 16,
    color: '#000000',
  },
  selectedReasonText: {
    color: '#ffffff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#cccccc',
  },
  submitButton: {
    backgroundColor: '#0000ff',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});