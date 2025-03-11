import React, { createContext, useContext, useState, useCallback } from 'react';
import { Report, ReportReason } from '../types/moderation';
import { mockModerationService } from '../services/mockModerationService';

interface ModerationContextType {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  moderationStats: {
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    aiDetections: number;
    communityVotes: number;
  } | null;
  loadReports: (sphereId: string) => Promise<void>;
  createReport: (
    contentId: string,
    contentType: 'post' | 'comment' | 'sphere',
    reason: ReportReason,
    description: string
  ) => Promise<void>;
  submitVote: (reportId: string, vote: 'remove' | 'keep') => Promise<void>;
}

const ModerationContext = createContext<ModerationContextType | null>(null);

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
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moderationStats, setModerationStats] = useState<ModerationContextType['moderationStats']>(null);

  const loadReports = useCallback(async (sphereId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedReports = await mockModerationService.getReports(sphereId);
      const stats = await mockModerationService.getModerationStats();
      setReports(fetchedReports);
      setModerationStats(stats);
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
      const newReport = await mockModerationService.createReport(
        contentId,
        contentType,
        reason,
        description
      );
      setReports(prev => [newReport, ...prev]);
      const stats = await mockModerationService.getModerationStats();
      setModerationStats(stats);
    } catch (err) {
      setError('Failed to create report');
      console.error('Error creating report:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitVote = useCallback(async (reportId: string, vote: 'remove' | 'keep') => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedReport = await mockModerationService.submitVote(reportId, vote);
      setReports(prev =>
        prev.map(report =>
          report.id === reportId ? updatedReport : report
        )
      );
      const stats = await mockModerationService.getModerationStats();
      setModerationStats(stats);
    } catch (err) {
      setError('Failed to submit vote');
      console.error('Error submitting vote:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    reports,
    isLoading,
    error,
    moderationStats,
    loadReports,
    createReport,
    submitVote,
  };

  return (
    <ModerationContext.Provider value={value}>
      {children}
    </ModerationContext.Provider>
  );
};