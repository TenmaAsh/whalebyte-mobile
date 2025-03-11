export type MediaType = 'image' | 'video' | 'audio';

export interface Media {
  uri: string;
  type: MediaType;
  ipfsHash?: string;
}

export interface Post {
  id: string;
  sphereId: number;
  author: {
    id: string;
    address: string;
    username?: string;
  };
  content: {
    text: string;
    media?: Media[];
  };
  appreciationCount: number;
  commentCount: number;
  createdAt: string;
  status: 'active' | 'hidden' | 'deleted';
  tags: string[];
  blockchain_ref?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    address: string;
    username?: string;
  };
  content: string;
  parentComment?: string;
  appreciationCount: number;
  createdAt: string;
  status: 'active' | 'hidden' | 'deleted';
  blockchain_ref?: string;
}

export interface PostContextType {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  createPost: (sphereId: number, content: string, media?: Media[]) => Promise<Post>;
  appreciatePost: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string, parentCommentId?: string) => Promise<Comment>;
  loadPosts: (sphereId?: number) => Promise<void>;
  refresh: () => Promise<void>;
}