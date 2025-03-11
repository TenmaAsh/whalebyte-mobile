export type ReportReason = 
  | 'inappropriate_content'
  | 'hate_speech'
  | 'misinformation'
  | 'spam'
  | 'harassment'
  | 'violence'
  | 'copyright'
  | 'other';

export type AIReportReason =
  | 'child_nudity'
  | 'pedophilia'
  | 'child_violence'
  | 'violence_against_women'
  | 'rape'
  | 'extreme_violence'
  | 'hate_speech'
  | 'terrorism';

export interface Vote {
  userId: string;
  decision: 'remove' | 'keep';
  timestamp: number;
}

export interface Report {
  id: string;
  contentId: string;  // Can be postId or commentId
  contentType: 'post' | 'comment' | 'sphere';
  reporterId: string;
  reason: ReportReason;
  description: string;
  status: 'pending' | 'resolved' | 'rejected' | 'auto_removed';
  createdAt: number;
  updatedAt: number;
  votes: Vote[];
  aiFlags?: AIReportReason[];
  autoModerated?: boolean;
  moderatorNotes?: string;
}

export interface ModerationThresholds {
  minVotesRequired: number;  // Minimum votes needed for a decision
  removalThreshold: number;  // Percentage of remove votes needed for removal
  aiConfidenceThreshold: number;  // Confidence level needed for AI auto-removal
  votingPeriod: number;  // Time in milliseconds for voting period
}

export interface ModerationStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  rejectedReports: number;
  autoRemovedReports: number;
  averageResponseTime: number;
  aiDetections: number;
}

export interface ModerationContextType {
  // Reports and Voting
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  
  // Report actions
  createReport: (
    contentId: string,
    contentType: Report['contentType'],
    reason: ReportReason,
    description: string
  ) => Promise<void>;
  
  // Voting
  submitVote: (reportId: string, decision: Vote['decision']) => Promise<void>;
  getVotingStatus: (reportId: string) => {
    totalVotes: number;
    removeVotes: number;
    keepVotes: number;
    userVote?: Vote['decision'];
    timeRemaining: number;
  };
  
  // AI Moderation
  checkContent: (
    content: string,
    mediaUrls: string[]
  ) => Promise<{
    isAllowed: boolean;
    flags: AIReportReason[];
    confidence: number;
  }>;
  
  // Stats and utilities
  getModerationStats: () => Promise<ModerationStats>;
  getThresholds: () => Promise<ModerationThresholds>;
  
  // Refresh functions
  refreshReports: () => Promise<void>;
}