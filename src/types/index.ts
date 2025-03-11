export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
  bio?: string;
  tokenBalance: number;
  joinedSpheres: string[];
  createdAt: string;
  lastActive: string;
  status: 'active' | 'suspended';
  reputation: number;
  walletAddress: string;
}

export interface Sphere {
  id: string;
  name: string;
  description: string;
  creator: string;
  type: 'free' | 'premium';
  entryFee: number;
  moderators: string[];
  memberCount: number;
  rules: string[];
  createdAt: string;
  status: 'active' | 'archived';
  categories: string[];
  bannerImage?: string;
}

export interface Post {
  id: string;
  sphereId: string;
  author: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  content: {
    text: string;
    media: string[];
    mediaType: ('image' | 'video' | 'audio')[];
  };
  appreciationCount: number;
  commentCount: number;
  createdAt: string;
  status: 'active' | 'hidden' | 'deleted';
  tags: string[];
  blockchain_ref?: string;
  hasAppreciated?: boolean;
  moderationStatus?: 'active' | 'under_review' | 'removed';
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  content: string;
  parentComment?: string;
  appreciationCount: number;
  createdAt: string;
  status: 'active' | 'hidden' | 'deleted';
  blockchain_ref?: string;
}

export interface Transaction {
  id: string;
  fromUser: string;
  toUser: string;
  amount: number;
  type: 'appreciation' | 'sphere-entry' | 'reward' | 'penalty';
  relatedEntity: {
    type: 'post' | 'comment' | 'sphere';
    id: string;
  };
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  blockchain_ref?: string;
}

export interface Report {
  id: string;
  reporter: string;
  reportedEntity: {
    type: 'post' | 'comment' | 'user';
    id: string;
  };
  reason: ReportReason;
  status: ReportStatus;
  moderatorActions: ModeratorAction[];
  aiReviewResult?: {
    score: number;
    flags: string[];
    timestamp: string;
  };
  createdAt: string;
  description?: string;
  removeVotes: number;
  keepVotes: number;
  content?: Post | Comment;
}

export type ReportReason =
  | 'inappropriate_content'
  | 'hate_speech'
  | 'misinformation'
  | 'spam'
  | 'harassment'
  | 'violence'
  | 'copyright'
  | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved';

export interface ModeratorAction {
  moderator: string;
  action: 'remove' | 'keep' | 'flag';
  timestamp: string;
}