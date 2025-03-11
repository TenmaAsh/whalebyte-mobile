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
import { Post } from '../../types/post';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
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
        { text: 'Cancel', style: 'cancel' },
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderModerationStatus = () => {
    if (post.moderationStatus === 'under_review') {
      return (
        <View style={[styles.moderationBadge, styles.underReviewBadge]}>
          <Text style={styles.moderationText}>Under Review</Text>
        </View>
      );
    } else if (post.moderationStatus === 'removed') {
      return (
        <View style={[styles.moderationBadge, styles.removedBadge]}>
          <Text style={styles.moderationText}>Removed</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        disabled={post.moderationStatus === 'removed'}
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{post.author.username}</Text>
            <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
          </View>
          {renderModerationStatus()}
        </View>

        {post.moderationStatus !== 'removed' ? (
          <>
            <Text style={styles.text}>{post.content}</Text>

            {post.media && post.media.length > 0 && (
              <View style={styles.mediaContainer}>
                {post.media.map((media, index) => (
                  <Image
                    key={index}
                    source={{ uri: media.url }}
                    style={styles.media}
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
                <Ionicons
                  name={post.hasAppreciated ? 'heart' : 'heart-outline'}
                  size={24}
                  color={post.hasAppreciated ? '#ff0000' : '#666666'}
                />
                <Text style={styles.actionText}>
                  {post.appreciationCount || 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onPress && onPress()}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#666666" />
                <Text style={styles.actionText}>{post.commentCount || 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setReportModalVisible(true)}
              >
                <Ionicons name="flag-outline" size={24} color="#666666" />
              </TouchableOpacity>

              {user?.id === post.author.id && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={24} color="#666666" />
                </TouchableOpacity>
              )}
            </View>
          </>
        ) : (
          <Text style={styles.removedText}>
            This content has been removed for violating community guidelines.
          </Text>
        )}
      </TouchableOpacity>

      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        contentId={post.id}
        contentType="post"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  moderationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  underReviewBadge: {
    backgroundColor: '#ffd700',
  },
  removedBadge: {
    backgroundColor: '#ff0000',
  },
  moderationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  media: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666666',
  },
  removedText: {
    fontSize: 16,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
});