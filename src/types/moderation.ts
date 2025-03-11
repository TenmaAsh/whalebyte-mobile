export type ReportReason = 
  | 'spam'
  | 'harassment'
  | 'inappropriate_content'
  | 'hate_speech'
  | 'misinformation'
  | 'copyright'
  | 'other';

export interface Report {
  id: string;
  postId: string;
  reporterId: string;
  reason: ReportReason;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  createdAt: number;
  updatedAt: number;
  moderatorId?: string;
  moderatorNotes?: string;
}

export interface ModerationAction {
  id: string;
  postId: string;
  moderatorId: string;
  action: 'remove' | 'restore' | 'warn' | 'ban';
  reason: string;
  createdAt: number;
}

export interface ModerationStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  rejectedReports: number;
  averageResponseTime: number;
}

export interface ModerationContextType {
  // Reports
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  
  // Report actions
  createReport: (postId: string, reason: ReportReason, description: string) => Promise<void>;
  updateReportStatus: (reportId: string, status: Report['status'], notes?: string) => Promise<void>;
  
  // Moderation actions
  removePost: (postId: string, reason: string) => Promise<void>;
  restorePost: (postId: string, reason: string) => Promise<void>;
  warnUser: (userId: string, reason: string) => Promise<void>;
  banUser: (userId: string, reason: string) => Promise<void>;
  
  // Stats and utilities
  getModerationStats: () => Promise<ModerationStats>;
  isModerator: (userId: string, sphereId: string) => Promise<boolean>;
  
  // Refresh functions
  refreshReports: () => Promise<void>;
}