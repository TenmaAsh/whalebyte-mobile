import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import { Post } from '../../types/post';
import { ReportModal } from '../moderation/ReportModal';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPress }) => {
  const { appreciatePost, deletePost } = usePost();
  const { user } = useAuth();
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const handleAppreciate = async () => {
    try {
      await appreciatePost(post.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to appreciate post');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(post.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const showOptions = () => {
    Alert.alert(
      'Post Options',
      'What would you like to do?',
      [
        {
          text: 'Report',
          onPress: () => setReportModalVisible(true),
        },
        user?.id === post.author.id
          ? {
              text: 'Delete',
              style: 'destructive',
              onPress: handleDelete,
            }
          : null,
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ].filter(Boolean) as any
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <View style={styles.header}>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author.username}</Text>
            <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
          </View>
          <TouchableOpacity onPress={showOptions}>
            <Ionicons name="ellipsis-vertical" size={24} color="#666666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.content}>{post.content}</Text>

        {post.media && post.media.length > 0 && (
          <View style={styles.mediaContainer}>
            {post.media.map((media, index) => (
              <Image
                key={index}
                source={{ uri: media.url }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAppreciate}
          >
            <Ionicons name="heart-outline" size={24} color="#666666" />
            <Text style={styles.actionText}>{post.appreciationCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#666666" />
            <Text style={styles.actionText}>{post.commentCount}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        postId={post.id}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  postDate: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  content: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
  mediaContainer: {
    marginBottom: 12,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666666',
  },
});