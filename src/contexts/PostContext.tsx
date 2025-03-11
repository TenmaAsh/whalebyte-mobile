import React, { createContext, useContext, useState, useCallback } from 'react';
import { Post, Comment, Media, PostContextType } from '../types/post';
import { useAuth } from './AuthContext';
import { useBlockchain } from './BlockchainContext';

const PostContext = createContext<PostContextType | null>(null);

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { account } = useBlockchain();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadPosts = useCallback(async (sphereId?: number) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call to fetch posts
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for development
      const mockPosts: Post[] = [
        {
          id: '1',
          sphereId: sphereId || 1,
          author: {
            id: '1',
            address: account || '',
            username: 'User1',
          },
          content: {
            text: 'This is a test post',
            media: [],
          },
          appreciationCount: 5,
          commentCount: 2,
          createdAt: new Date().toISOString(),
          status: 'active',
          tags: ['test'],
          blockchain_ref: '0x...',
        },
      ];

      setPosts(mockPosts);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError(err instanceof Error ? err : new Error('Failed to load posts'));
    } finally {
      setLoading(false);
    }
  }, [account]);

  const createPost = useCallback(async (sphereId: number, content: string, media?: Media[]) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate post creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPost: Post = {
        id: Math.random().toString(36).substring(7),
        sphereId,
        author: {
          id: user?.id || '',
          address: user?.walletAddress || '',
          username: user?.username,
        },
        content: {
          text: content,
          media,
        },
        appreciationCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString(),
        status: 'active',
        tags: [],
      };

      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      console.error('Failed to create post:', err);
      setError(err instanceof Error ? err : new Error('Failed to create post'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const appreciatePost = useCallback(async (postId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1000));

      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, appreciationCount: post.appreciationCount + 1 }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to appreciate post:', err);
      setError(err instanceof Error ? err : new Error('Failed to appreciate post'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate post deletion
      await new Promise(resolve => setTimeout(resolve, 1000));

      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete post'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (postId: string, content: string, parentCommentId?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate comment creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newComment: Comment = {
        id: Math.random().toString(36).substring(7),
        postId,
        author: {
          id: user?.id || '',
          address: user?.walletAddress || '',
          username: user?.username,
        },
        content,
        parentComment: parentCommentId,
        appreciationCount: 0,
        createdAt: new Date().toISOString(),
        status: 'active',
      };

      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, commentCount: post.commentCount + 1 }
            : post
        )
      );

      return newComment;
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError(err instanceof Error ? err : new Error('Failed to add comment'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refresh = useCallback(async () => {
    await loadPosts();
  }, [loadPosts]);

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        createPost,
        appreciatePost,
        deletePost,
        addComment,
        loadPosts,
        refresh,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};