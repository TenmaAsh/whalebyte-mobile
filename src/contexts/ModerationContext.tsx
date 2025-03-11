import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import {
  Report,
  ReportReason,
  ModerationStats,
  ModerationAction,
  ModerationContextType,
} from '../types/moderation';

const ModerationContext = createContext<ModerationContextType | undefined>(undefined);

export const useModeration = () => {
  const context = useContext(ModerationContext);
  if (!context) {
    throw new Error('useModeration must be used within a ModerationProvider');
  }
  return context;
};

export const ModerationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReport = useCallback(async (
    postId: string,
    reason: ReportReason,
    description: string
  ) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to report content');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation:
      // 1. Call your backend API to create a report
      // 2. Update local state with the new report
      // 3. Handle any errors appropriately

      const newReport: Report = {
        id: Date.now().toString(),
        postId,
        reporterId: user.id,
        reason,
        description,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setReports(prev => [...prev, newReport]);
      Alert.alert('Success', 'Report submitted successfully');
    } catch (err) {
      setError('Failed to create report');
      Alert.alert('Error', 'Failed to submit report');
      console.error('Error creating report:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateReportStatus = useCallback(async (
    reportId: string,
    status: Report['status'],
    notes?: string
  ) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to update reports');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation:
      // 1. Verify user is a moderator
      // 2. Call your backend API to update the report
      // 3. Update local state with the changes
      // 4. Handle any errors appropriately

      setReports(prev =>
        prev.map(report =>
          report.id === reportId
            ? {
                ...report,
                status,
                moderatorId: user.id,
                moderatorNotes: notes,
                updatedAt: Date.now(),
              }
            : report
        )
      );

      Alert.alert('Success', 'Report status updated successfully');
    } catch (err) {
      setError('Failed to update report status');
      Alert.alert('Error', 'Failed to update report status');
      console.error('Error updating report status:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const removePost = useCallback(async (postId: string, reason: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to moderate content');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation:
      // 1. Verify user is a moderator
      // 2. Call your backend API to remove the post
      // 3. Update local state
      // 4. Handle any errors appropriately

      const action: ModerationAction = {
        id: Date.now().toString(),
        postId,
        moderatorId: user.id,
        action: 'remove',
        reason,
        createdAt: Date.now(),
      };

      // Update related reports
      setReports(prev =>
        prev.map(report =>
          report.postId === postId
            ? { ...report, status: 'resolved', updatedAt: Date.now() }
            : report
        )
      );

      Alert.alert('Success', 'Post removed successfully');
    } catch (err) {
      setError('Failed to remove post');
      Alert.alert('Error', 'Failed to remove post');
      console.error('Error removing post:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const restorePost = useCallback(async (postId: string, reason: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to moderate content');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const action: ModerationAction = {
        id: Date.now().toString(),
        postId,
        moderatorId: user.id,
        action: 'restore',
        reason,
        createdAt: Date.now(),
      };

      Alert.alert('Success', 'Post restored successfully');
    } catch (err) {
      setError('Failed to restore post');
      Alert.alert('Error', 'Failed to restore post');
      console.error('Error restoring post:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const warnUser = useCallback(async (userId: string, reason: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to moderate users');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const action: ModerationAction = {
        id: Date.now().toString(),
        postId: userId, // Using postId for userId in this case
        moderatorId: user.id,
        action: 'warn',
        reason,
        createdAt: Date.now(),
      };

      Alert.alert('Success', 'User warned successfully');
    } catch (err) {
      setError('Failed to warn user');
      Alert.alert('Error', 'Failed to warn user');
      console.error('Error warning user:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const banUser = useCallback(async (userId: string, reason: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to moderate users');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const action: ModerationAction = {
        id: Date.now().toString(),
        postId: userId, // Using postId for userId in this case
        moderatorId: user.id,
        action: 'ban',
        reason,
        createdAt: Date.now(),
      };

      Alert.alert('Success', 'User banned successfully');
    } catch (err) {
      setError('Failed to ban user');
      Alert.alert('Error', 'Failed to ban user');
      console.error('Error banning user:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getModerationStats = useCallback(async (): Promise<ModerationStats> => {
    try {
      // In a real implementation:
      // 1. Call your backend API to get statistics
      // 2. Calculate or retrieve real metrics

      const stats: ModerationStats = {
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        resolvedReports: reports.filter(r => r.status === 'resolved').length,
        rejectedReports: reports.filter(r => r.status === 'rejected').length,
        averageResponseTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      };

      return stats;
    } catch (err) {
      console.error('Error getting moderation stats:', err);
      throw new Error('Failed to get moderation stats');
    }
  }, [reports]);

  const isModerator = useCallback(async (userId: string, sphereId: string): Promise<boolean> => {
    try {
      // In a real implementation:
      // 1. Check user's roles in the specified sphere
      // 2. Verify moderator status from your backend
      return true; // Mock implementation
    } catch (err) {
      console.error('Error checking moderator status:', err);
      return false;
    }
  }, []);

  const refreshReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation:
      // 1. Fetch fresh reports from your backend
      // 2. Update local state with the new data

      // Mock implementation: do nothing for now
    } catch (err) {
      setError('Failed to refresh reports');
      console.error('Error refreshing reports:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: ModerationContextType = {
    reports,
    isLoading,
    error,
    createReport,
    updateReportStatus,
    removePost,
    restorePost,
    warnUser,
    banUser,
    getModerationStats,
    isModerator,
    refreshReports,
  };

  return (
    <ModerationContext.Provider value={value}>
      {children}
    </ModerationContext.Provider>
  );
};