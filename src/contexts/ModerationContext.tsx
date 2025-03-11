import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Report,
  ReportReason,
  ReportStatus,
  ModerationStats,
} from '../types/moderation';
import {
  MOCK_REPORTS,
  MOCK_MODERATION_STATS,
  simulateAICheck,
  checkVotingThreshold,
  simulateReportResolution,
  createMockReport,
} from '../utils/testData';

interface ModerationContextType {
  reports: Report[];
  moderationStats: ModerationStats;
  isLoading: boolean;
  error: string | null;
  loadReports: (sphereId: string) => Promise<void>;
  createReport: (
    contentId: string,
    contentType: 'post' | 'comment' | 'sphere',
    reason: ReportReason,
    description: string
  ) => Promise<void>;
  submitVote: (reportId: string, vote: 'remove' | 'keep') => Promise<void>;
  checkContent: (content: string) => Promise<number>;
}

const ModerationContext = createContext<ModerationContextType | undefined>(undefined);

export const useModeration = () => {
  const context = useContext(ModerationContext);
  if (!context) {
    throw new Error('useModeration must be used within a ModerationProvider');
  }
  return context;
};

export const ModerationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [moderationStats, setModerationStats] = useState<ModerationStats>(MOCK_MODERATION_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async (sphereId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // In development, we're using mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setReports(MOCK_REPORTS);
      setModerationStats(MOCK_MODERATION_STATS);
    } catch (err) {
      setError('Failed to load reports');
      console.error('Error loading reports:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReport = useCallback(async (
    contentId: string,
    contentType: 'post' | 'comment' | 'sphere',
    reason: ReportReason,
    description: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate AI content check
      const aiConfidence = await simulateAICheck(description);
      
      const newReport = createMockReport({
        contentId,
        contentType,
        reason,
        description,
        aiConfidence: aiConfidence > 0.5 ? aiConfidence : null,
      });

      // Update reports list
      setReports(prev => [...prev, newReport]);
      
      // Update stats
      setModerationStats(prev => ({
        ...prev,
        totalReports: prev.totalReports + 1,
        pendingReports: prev.pendingReports + 1,
        aiDetections: aiConfidence > 0.8 ? prev.aiDetections + 1 : prev.aiDetections,
      }));

      // If AI confidence is high, automatically resolve the report
      if (aiConfidence > 0.8) {
        await submitVote(newReport.id, 'remove');
      }
    } catch (err) {
      setError('Failed to create report');
      console.error('Error creating report:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitVote = useCallback(async (reportId: string, vote: 'remove' | 'keep') => {
    setIsLoading(true);
    setError(null);
    try {
      setReports(prev => {
        const updatedReports = prev.map(report => {
          if (report.id === reportId) {
            const updatedReport = {
              ...report,
              removeVotes: vote === 'remove' ? report.removeVotes + 1 : report.removeVotes,
              keepVotes: vote === 'keep' ? report.keepVotes + 1 : report.keepVotes,
            };

            // Check if the report should be resolved
            const newStatus = simulateReportResolution(updatedReport);
            if (newStatus === 'resolved' && report.status === 'pending') {
              setModerationStats(prev => ({
                ...prev,
                pendingReports: prev.pendingReports - 1,
                resolvedReports: prev.resolvedReports + 1,
                communityVotes: prev.communityVotes + 1,
              }));
            }

            return {
              ...updatedReport,
              status: newStatus,
            };
          }
          return report;
        });

        return updatedReports;
      });
    } catch (err) {
      setError('Failed to submit vote');
      console.error('Error submitting vote:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkContent = useCallback(async (content: string): Promise<number> => {
    try {
      return await simulateAICheck(content);
    } catch (err) {
      console.error('Error checking content:', err);
      return 0;
    }
  }, []);

  const value = {
    reports,
    moderationStats,
    isLoading,
    error,
    loadReports,
    createReport,
    submitVote,
    checkContent,
  };

  return (
    <ModerationContext.Provider value={value}>
      {children}
    </ModerationContext.Provider>
  );
};