import { User, Sphere, Post, Comment, Transaction, Report } from '../types';

// Helper function to generate random IDs
const generateId = () => Math.random().toString(36).substring(7);

// Helper function to generate random dates within the last month
const generateDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString();
};

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    email: 'john@example.com',
    username: 'JohnDoe',
    profilePicture: 'https://i.pravatar.cc/150?u=john',
    bio: 'Blockchain enthusiast and cat lover',
    tokenBalance: 500,
    joinedSpheres: ['sphere1', 'sphere2'],
    createdAt: generateDate(),
    lastActive: new Date().toISOString(),
    status: 'active',
    reputation: 85,
    walletAddress: '0x1234...5678',
  },
  {
    id: 'user2',
    email: 'jane@example.com',
    username: 'JaneSmith',
    profilePicture: 'https://i.pravatar.cc/150?u=jane',
    bio: 'Tech writer and community moderator',
    tokenBalance: 750,
    joinedSpheres: ['sphere1'],
    createdAt: generateDate(),
    lastActive: new Date().toISOString(),
    status: 'active',
    reputation: 92,
    walletAddress: '0x9876...4321',
  },
];

// Mock Spheres
export const MOCK_SPHERES: Sphere[] = [
  {
    id: 'sphere1',
    name: 'Tech Talk',
    description: 'Discuss the latest in technology and innovation',
    creator: 'user1',
    type: 'free',
    entryFee: 0,
    moderators: ['user2'],
    memberCount: 1250,
    rules: [
      'Be respectful',
      'No spam',
      'Stay on topic',
    ],
    createdAt: generateDate(),
    status: 'active',
    categories: ['technology', 'innovation', 'programming'],
    bannerImage: 'https://picsum.photos/800/200',
  },
  {
    id: 'sphere2',
    name: 'Crypto World',
    description: 'Everything about cryptocurrencies and blockchain',
    creator: 'user2',
    type: 'premium',
    entryFee: 50,
    moderators: ['user1'],
    memberCount: 750,
    rules: [
      'No financial advice',
      'Be respectful',
      'Verify sources',
    ],
    createdAt: generateDate(),
    status: 'active',
    categories: ['cryptocurrency', 'blockchain', 'defi'],
    bannerImage: 'https://picsum.photos/800/200',
  },
];

// Mock Posts
export const MOCK_POSTS: Post[] = [
  {
    id: 'post1',
    sphereId: 'sphere1',
    author: {
      id: 'user1',
      username: 'JohnDoe',
      profilePicture: 'https://i.pravatar.cc/150?u=john',
    },
    content: {
      text: 'Just discovered an amazing new blockchain project! #innovation',
      media: ['https://picsum.photos/400/300'],
      mediaType: ['image'],
    },
    appreciationCount: 25,
    commentCount: 5,
    createdAt: generateDate(),
    status: 'active',
    tags: ['blockchain', 'technology'],
    blockchain_ref: '0xabcd...1234',
    hasAppreciated: false,
    moderationStatus: 'active',
  },
  {
    id: 'post2',
    sphereId: 'sphere2',
    author: {
      id: 'user2',
      username: 'JaneSmith',
      profilePicture: 'https://i.pravatar.cc/150?u=jane',
    },
    content: {
      text: 'Here's my analysis of the latest crypto trends... #analysis',
      media: [],
      mediaType: [],
    },
    appreciationCount: 42,
    commentCount: 8,
    createdAt: generateDate(),
    status: 'active',
    tags: ['cryptocurrency', 'analysis'],
    blockchain_ref: '0xefgh...5678',
    hasAppreciated: true,
    moderationStatus: 'active',
  },
];

// Mock Comments
export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    author: {
      id: 'user2',
      username: 'JaneSmith',
      profilePicture: 'https://i.pravatar.cc/150?u=jane',
    },
    content: 'Great analysis! Looking forward to more content like this.',
    appreciationCount: 8,
    createdAt: generateDate(),
    status: 'active',
    blockchain_ref: '0xijkl...9012',
  },
];

// Mock Transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    fromUser: 'user1',
    toUser: 'user2',
    amount: 10,
    type: 'appreciation',
    relatedEntity: {
      type: 'post',
      id: 'post2',
    },
    timestamp: generateDate(),
    status: 'completed',
    blockchain_ref: '0xmnop...3456',
  },
];

// Mock Reports
export const MOCK_REPORTS: Report[] = [
  {
    id: 'report1',
    reporter: 'user2',
    reportedEntity: {
      type: 'post',
      id: 'post1',
    },
    reason: 'misinformation',
    status: 'pending',
    moderatorActions: [],
    aiReviewResult: {
      score: 0.3,
      flags: ['potential_misinformation'],
      timestamp: generateDate(),
    },
    createdAt: generateDate(),
    description: 'Contains unverified claims about blockchain technology',
    removeVotes: 2,
    keepVotes: 1,
  },
];

class MockService {
  private users = [...MOCK_USERS];
  private spheres = [...MOCK_SPHERES];
  private posts = [...MOCK_POSTS];
  private comments = [...MOCK_COMMENTS];
  private transactions = [...MOCK_TRANSACTIONS];
  private reports = [...MOCK_REPORTS];

  // Simulate network delay
  private async delay(ms: number = 500): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  // User methods
  async getUser(userId: string): Promise<User | null> {
    await this.delay();
    return this.users.find(u => u.id === userId) || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    await this.delay();
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    Object.assign(user, updates);
    return user;
  }

  // Sphere methods
  async getSpheres(): Promise<Sphere[]> {
    await this.delay();
    return this.spheres;
  }

  async getSphere(sphereId: string): Promise<Sphere | null> {
    await this.delay();
    return this.spheres.find(s => s.id === sphereId) || null;
  }

  // Post methods
  async getPosts(sphereId?: string): Promise<Post[]> {
    await this.delay();
    return sphereId 
      ? this.posts.filter(p => p.sphereId === sphereId)
      : this.posts;
  }

  async createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
    await this.delay();
    const newPost = {
      ...post,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  // Comment methods
  async getComments(postId: string): Promise<Comment[]> {
    await this.delay();
    return this.comments.filter(c => c.postId === postId);
  }

  // Transaction methods
  async getTransactions(userId: string): Promise<Transaction[]> {
    await this.delay();
    return this.transactions.filter(
      t => t.fromUser === userId || t.toUser === userId
    );
  }

  // Report methods
  async getReports(sphereId?: string): Promise<Report[]> {
    await this.delay();
    return this.reports;
  }

  // Reset all data
  async resetData(): Promise<void> {
    this.users = [...MOCK_USERS];
    this.spheres = [...MOCK_SPHERES];
    this.posts = [...MOCK_POSTS];
    this.comments = [...MOCK_COMMENTS];
    this.transactions = [...MOCK_TRANSACTIONS];
    this.reports = [...MOCK_REPORTS];
  }
}

export const mockService = new MockService();