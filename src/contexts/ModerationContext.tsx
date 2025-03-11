import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import {
  Report,
  ReportReason,
  Vote,
  ModerationStats,
  ModerationThresholds,
  ModerationContextType,
  AIReportReason,
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

  // Default thresholds - in a real implementation, these would come from your backend
  const defaultThresholds: ModerationThresholds = {
    minVotesRequired: 5,
    removalThreshold: 0.66, // 66% votes needed for removal
    aiConfidenceThreshold: 0.9, // 90% confidence for AI auto-removal
    votingPeriod: 24 * 60 * 60 * 1000, // 24 hours
  };

  const checkContent = useCallback(async (
    content: string,
    mediaUrls: string[]
  ) => {
    try {
      // In a real implementation:
      // 1. Call your AI content moderation service (e.g., AWS Rekognition, Google Cloud Vision)
      // 2. Process both text and media content
      // 3. Apply confidence thresholds
      // 4. Return detailed analysis results

      // Mock implementation
      const hasIllegalContent = content.toLowerCase().includes('violence') ||
        content.toLowerCase().includes('abuse');

      return {
        isAllowed: !hasIllegalContent,
        flags: hasIllegalContent ? ['hate_speech' as AIReportReason] : [],
        confidence: hasIllegalContent ? 0.95 : 0.1,
      };
    } catch (err) {
      console.error('Error checking content:', err);
      throw new Error('Failed to check content');
    }
  }, []);

  const createReport = useCallback(async (
    contentId: string,
    contentType: Report['contentType'],
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
      // 2. Trigger AI content check
      // 3. Start voting period
      // 4. Handle auto-removal if AI flags serious violations

      const newReport: Report = {
        id: Date.now().toString(),
        contentId,
        contentType,
        reporterId: user.id,
        reason,
        description,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        votes: [],
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

  const submitVote = useCallback(async (
    reportId: string,
    decision: Vote['decision']
  ) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to vote');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation:
      // 1. Verify user hasn't voted before
      // 2. Add vote to the report
      // 3. Check if voting thresholds are met
      // 4. Auto-resolve if thresholds are met

      setReports(prev =>
        prev.map(report => {
          if (report.id !== reportId) return report;

          const existingVoteIndex = report.votes.findIndex(v => v.userId === user.id);
          let votes = [...report.votes];

          if (existingVoteIndex >= 0) {
            votes[existingVoteIndex] = { userId: user.id, decision, timestamp: Date.now() };
          } else {
            votes.push({ userId: user.id, decision, timestamp: Date.now() });
          }

          // Check if thresholds are met
          const totalVotes = votes.length;
          const removeVotes = votes.filter(v => v.decision === 'remove').length;
          const removePercentage = removeVotes / totalVotes;

          const thresholdsMet = totalVotes >= defaultThresholds.minVotesRequired &&
            removePercentage >= defaultThresholds.removalThreshold;

          return {
            ...report,
            votes,
            status: thresholdsMet ? 'resolved' : report.status,
            updatedAt: Date.now(),
          };
        })
      );

      Alert.alert('Success', 'Vote submitted successfully');
    } catch (err) {
      setError('Failed to submit vote');
      Alert.alert('Error', 'Failed to submit vote');
      console.error('Error submitting vote:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getVotingStatus = useCallback((reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) {
      return {
        totalVotes: 0,
        removeVotes: 0,
        keepVotes: 0,
        timeRemaining: 0,
      };
    }

    const totalVotes = report.votes.length;
    const removeVotes = report.votes.filter(v => v.decision === 'remove').length;
    const keepVotes = totalVotes - removeVotes;
    const timeElapsed = Date.now() - report.createdAt;
    const timeRemaining = Math.max(0, defaultThresholds.votingPeriod - timeElapsed);
    const userVote = user ? report.votes.find(v => v.userId === user.id)?.decision : undefined;

    return {
      totalVotes,
      removeVotes,
      keepVotes,
      userVote,
      timeRemaining,
    };
  }, [reports, user]);

  const getModerationStats = useCallback(async (): Promise<ModerationStats> => {
    try {
      const stats: ModerationStats = {
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        resolvedReports: reports.filter(r => r.status === 'resolved').length,
        rejectedReports: reports.filter(r => r.status === 'rejected').length,
        autoRemovedReports: reports.filter(r => r.status === 'auto_removed').length,
        averageResponseTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        aiDetections: reports.filter(r => r.autoModerated).length,
      };

      return stats;
    } catch (err) {
      console.error('Error getting moderation stats:', err);
      throw new Error('Failed to get moderation stats');
    }
  }, [reports]);

  const getThresholds = useCallback(async (): Promise<ModerationThresholds> => {
    // In a real implementation, fetch from backend
    return defaultThresholds;
  }, []);

  const refreshReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation:
      // 1. Fetch fresh reports from your backend
      // 2. Update local state with the new data
      // 3. Check for any resolved votes
      // 4. Process any pending AI moderations

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
    submitVote,
    getVotingStatus,
    checkContent,
    getModerationStats,
    getThresholds,
    refreshReports,
  };

  return (
    <ModerationContext.Provider value={value}>
      {children}
    </ModerationContext.Provider>
  );
};