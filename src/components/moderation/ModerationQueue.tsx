import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useModeration } from '../../contexts/ModerationContext';
import { Report } from '../../types/moderation';

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  onAction: (action: string, reason: string) => Promise<void>;
}

const ReportItem: React.FC<{
  report: Report;
  onAction: (action: 'resolve' | 'reject', notes?: string) => Promise<void>;
}> = ({ report, onAction }) => {
  const handleResolve = () => {
    Alert.prompt(
      'Resolve Report',
      'Add any notes about this resolution:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Resolve',
          onPress: (notes) => onAction('resolve', notes || undefined),
        },
      ],
      'plain-text'
    );
  };

  const handleReject = () => {
    Alert.prompt(
      'Reject Report',
      'Add any notes about this rejection:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          onPress: (notes) => onAction('reject', notes || undefined),
        },
      ],
      'plain-text'
    );
  };

  return (
    <View style={styles.reportItem}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportReason}>{report.reason}</Text>
        <Text style={styles.reportDate}>
          {new Date(report.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.reportDescription}>{report.description}</Text>

      <View style={styles.reportActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.resolveButton]}
          onPress={handleResolve}
        >
          <Text style={styles.actionButtonText}>Resolve</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={handleReject}
        >
          <Text style={styles.actionButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const ModerationQueue: React.FC = () => {
  const {
    reports,
    isLoading,
    error,
    updateReportStatus,
    refreshReports,
    getModerationStats,
  } = useModeration();

  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    rejectedReports: 0,
    averageResponseTime: 0,
  });

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, [reports]);

  const loadStats = async () => {
    try {
      const newStats = await getModerationStats();
      setStats(newStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshReports();
    await loadStats();
    setRefreshing(false);
  };

  const handleReportAction = async (
    report: Report,
    action: 'resolve' | 'reject',
    notes?: string
  ) => {
    try {
      await updateReportStatus(
        report.id,
        action === 'resolve' ? 'resolved' : 'rejected',
        notes
      );
      await refreshReports();
    } catch (err) {
      console.error('Error handling report action:', err);
      Alert.alert('Error', 'Failed to process report action');
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshReports}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.pendingReports}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.resolvedReports}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.rejectedReports}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
      </View>

      {isLoading && reports.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView
          style={styles.reportsContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {reports
            .filter((report) => report.status === 'pending')
            .map((report) => (
              <ReportItem
                key={report.id}
                report={report}
                onAction={(action, notes) =>
                  handleReportAction(report, action, notes)
                }
              />
            ))}

          {reports.filter((report) => report.status === 'pending').length === 0 && (
            <Text style={styles.emptyText}>No pending reports</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0000ff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  reportsContainer: {
    flex: 1,
    padding: 16,
  },
  reportItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reportReason: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  reportDate: {
    fontSize: 14,
    color: '#666666',
  },
  reportDescription: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 16,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  resolveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0000ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    marginTop: 32,
  },
});