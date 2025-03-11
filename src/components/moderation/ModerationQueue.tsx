import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useModeration } from '../../contexts/ModerationContext';
import { Report, ReportStatus } from '../../types/moderation';
import { PostCard } from '../posts/PostCard';

interface ModerationQueueProps {
  sphereId: string;
}

export const ModerationQueue: React.FC<ModerationQueueProps> = ({ sphereId }) => {
  const {
    reports,
    loadReports,
    submitVote,
    isLoading,
    error,
    moderationStats,
  } = useModeration();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    loadReports(sphereId);
  }, [sphereId]);

  const handleVote = async (reportId: string, vote: 'remove' | 'keep') => {
    try {
      await submitVote(reportId, vote);
      Alert.alert('Success', 'Your vote has been recorded');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit vote. Please try again.');
    }
  };

  const renderReportItem = ({ item: report }: { item: Report }) => {
    const isSelected = selectedReport?.id === report.id;

    return (
      <View style={styles.reportItem}>
        <TouchableOpacity
          style={[styles.reportHeader, isSelected && styles.selectedReport]}
          onPress={() => setSelectedReport(isSelected ? null : report)}
        >
          <View style={styles.reportInfo}>
            <Text style={styles.reportReason}>{report.reason}</Text>
            <Text style={styles.reportDate}>
              {new Date(report.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.voteCount}>
            <Text style={styles.voteText}>
              Remove: {report.removeVotes} | Keep: {report.keepVotes}
            </Text>
            <Text style={styles.statusText}>
              Status: {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>

        {isSelected && (
          <View style={styles.reportContent}>
            {report.contentType === 'post' && (
              <PostCard post={report.content} />
            )}
            
            <View style={styles.reportDescription}>
              <Text style={styles.descriptionLabel}>Report Description:</Text>
              <Text style={styles.descriptionText}>{report.description}</Text>
            </View>

            {report.status === 'pending' && (
              <View style={styles.voteButtons}>
                <TouchableOpacity
                  style={[styles.voteButton, styles.keepButton]}
                  onPress={() => handleVote(report.id, 'keep')}
                >
                  <Text style={styles.voteButtonText}>Keep Content</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.voteButton, styles.removeButton]}
                  onPress={() => handleVote(report.id, 'remove')}
                >
                  <Text style={styles.voteButtonText}>Remove Content</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading reports: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Moderation Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{moderationStats?.totalReports || 0}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{moderationStats?.pendingReports || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{moderationStats?.resolvedReports || 0}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No reports to review</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
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
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  reportItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  reportHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedReport: {
    backgroundColor: '#f0f0ff',
  },
  reportInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reportReason: {
    fontSize: 16,
    fontWeight: '600',
  },
  reportDate: {
    fontSize: 14,
    color: '#666666',
  },
  voteCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voteText: {
    fontSize: 14,
    color: '#666666',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reportContent: {
    padding: 16,
  },
  reportDescription: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  voteButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  voteButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  keepButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#f44336',
  },
  voteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666666',
    marginTop: 24,
  },
});