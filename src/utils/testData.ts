import { Post } from '../types/post';
import { Report, ReportReason, ReportStatus } from '../types/moderation';

export const createMockPost = (overrides?: Partial<Post>): Post => ({
  id: Math.random().toString(36).substring(7),
  sphereId: 'test-sphere',
  author: {
    id: 'test-user',
    username: 'TestUser',
    avatarUrl: 'https://via.placeholder.com/50',
  },
  content: 'This is a test post content',
  media: [],
  appreciationCount: 0,
  commentCount: 0,
  hasAppreciated: false,
  createdAt: new Date().toISOString(),
  moderationStatus: 'active',
  tags: [],
  ...overrides,
});

export const createMockReport = (overrides?: Partial<Report>): Report => ({
  id: Math.random().toString(36).substring(7),
  contentId: 'test-content',
  contentType: 'post',
  reason: 'inappropriate_content' as ReportReason,
  description: 'This is a test report',
  reporterId: 'test-reporter',
  createdAt: new Date().toISOString(),
  status: 'pending' as ReportStatus,
  removeVotes: 0,
  keepVotes: 0,
  aiConfidence: null,
  content: createMockPost(),
  ...overrides,
});

export const MOCK_POSTS: Post[] = [
  createMockPost({
    content: 'Normal post for testing',
    moderationStatus: 'active',
  }),
  createMockPost({
    content: 'Post under review',
    moderationStatus: 'under_review',
  }),
  createMockPost({
    content: 'Removed post',
    moderationStatus: 'removed',
  }),
];

export const MOCK_REPORTS: Report[] = [
  createMockReport({
    reason: 'inappropriate_content',
    status: 'pending',
    removeVotes: 2,
    keepVotes: 1,
  }),
  createMockReport({
    reason: 'hate_speech',
    status: 'resolved',
    removeVotes: 5,
    keepVotes: 1,
    aiConfidence: 0.85,
  }),
  createMockReport({
    reason: 'spam',
    status: 'pending',
    removeVotes: 1,
    keepVotes: 3,
  }),
];

export const MOCK_MODERATION_STATS = {
  totalReports: 10,
  pendingReports: 3,
  resolvedReports: 7,
  aiDetections: 2,
  communityVotes: 25,
};

// Simulates AI content check with random confidence score
export const simulateAICheck = async (content: string): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  return Math.random();
};

// Simulates voting threshold check
export const checkVotingThreshold = (removeVotes: number, keepVotes: number): boolean => {
  const totalVotes = removeVotes + keepVotes;
  const removePercentage = (removeVotes / totalVotes) * 100;
  return totalVotes >= 5 && removePercentage >= 60;
};

// Helper to simulate report resolution
export const simulateReportResolution = (report: Report): ReportStatus => {
  if (report.aiConfidence && report.aiConfidence > 0.8) {
    return 'resolved';
  }
  if (checkVotingThreshold(report.removeVotes, report.keepVotes)) {
    return 'resolved';
  }
  return 'pending';
};