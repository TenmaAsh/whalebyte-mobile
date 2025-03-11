import { Post } from '../types/post';
import { Report, ReportReason, ReportStatus } from '../types/moderation';
import {
  MOCK_POSTS,
  MOCK_REPORTS,
  MOCK_MODERATION_STATS,
  simulateAICheck,
  createMockReport,
  createMockPost,
} from '../utils/testData';

class MockModerationService {
  private posts: Post[] = [...MOCK_POSTS];
  private reports: Report[] = [...MOCK_REPORTS];
  private stats = { ...MOCK_MODERATION_STATS };

  // Simulate network delay
  private async delay(ms: number = 500): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  // Posts
  async getPosts(): Promise<Post[]> {
    await this.delay();
    return this.posts;
  }

  async createPost(content: string, sphereId: string, media: any[] = []): Promise<Post> {
    await this.delay();
    const newPost = createMockPost({
      content,
      sphereId,
      media,
      createdAt: new Date().toISOString(),
    });
    this.posts.unshift(newPost);
    return newPost;
  }

  async updatePostStatus(postId: string, status: 'active' | 'under_review' | 'removed'): Promise<Post> {
    await this.delay();
    const post = this.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    
    post.moderationStatus = status;
    return post;
  }

  // Reports
  async getReports(sphereId: string): Promise<Report[]> {
    await this.delay();
    return this.reports.filter(report => 
      (report.content as Post).sphereId === sphereId
    );
  }

  async createReport(
    contentId: string,
    contentType: 'post' | 'comment' | 'sphere',
    reason: ReportReason,
    description: string
  ): Promise<Report> {
    await this.delay();
    
    // Find the content being reported
    const content = this.posts.find(p => p.id === contentId);
    if (!content) throw new Error('Content not found');

    // Simulate AI check for certain report types
    let aiConfidence: number | null = null;
    if (['hate_speech', 'violence', 'inappropriate_content'].includes(reason)) {
      aiConfidence = await simulateAICheck(content.content);
    }

    const newReport = createMockReport({
      contentId,
      contentType,
      reason,
      description,
      content,
      aiConfidence,
      createdAt: new Date().toISOString(),
    });

    // Update content status if AI confidence is high
    if (aiConfidence && aiConfidence > 0.8) {
      await this.updatePostStatus(contentId, 'removed');
      newReport.status = 'resolved';
    } else {
      await this.updatePostStatus(contentId, 'under_review');
    }

    this.reports.unshift(newReport);
    this.updateStats();
    return newReport;
  }

  async submitVote(reportId: string, vote: 'remove' | 'keep'): Promise<Report> {
    await this.delay();
    const report = this.reports.find(r => r.id === reportId);
    if (!report) throw new Error('Report not found');
    if (report.status !== 'pending') throw new Error('Report is no longer pending');

    // Update vote count
    if (vote === 'remove') {
      report.removeVotes++;
    } else {
      report.keepVotes++;
    }

    // Check if voting threshold is reached
    const totalVotes = report.removeVotes + report.keepVotes;
    const removePercentage = (report.removeVotes / totalVotes) * 100;

    if (totalVotes >= 5 && removePercentage >= 60) {
      report.status = 'resolved';
      await this.updatePostStatus(report.contentId, 'removed');
    } else if (totalVotes >= 5 && removePercentage < 40) {
      report.status = 'resolved';
      await this.updatePostStatus(report.contentId, 'active');
    }

    this.updateStats();
    return report;
  }

  async getModerationStats(): Promise<typeof MOCK_MODERATION_STATS> {
    await this.delay();
    return this.stats;
  }

  private updateStats(): void {
    this.stats = {
      totalReports: this.reports.length,
      pendingReports: this.reports.filter(r => r.status === 'pending').length,
      resolvedReports: this.reports.filter(r => r.status === 'resolved').length,
      aiDetections: this.reports.filter(r => r.aiConfidence !== null && r.aiConfidence > 0.8).length,
      communityVotes: this.reports.reduce((sum, report) => 
        sum + report.removeVotes + report.keepVotes, 0
      ),
    };
  }

  // Test helpers
  async resetMockData(): Promise<void> {
    this.posts = [...MOCK_POSTS];
    this.reports = [...MOCK_REPORTS];
    this.updateStats();
  }

  async generateTestReport(overrides?: Partial<Report>): Promise<Report> {
    const report = createMockReport(overrides);
    this.reports.unshift(report);
    this.updateStats();
    return report;
  }

  async generateTestPost(overrides?: Partial<Post>): Promise<Post> {
    const post = createMockPost(overrides);
    this.posts.unshift(post);
    return post;
  }
}

export const mockModerationService = new MockModerationService();