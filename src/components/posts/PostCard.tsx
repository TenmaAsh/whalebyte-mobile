import React from 'react';
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
import { formatAddress } from '../../utils/format';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPress }) => {
  const { appreciatePost, deletePost } = usePost();
  const { user } = useAuth();
  const isAuthor = user?.id === post.author.id;

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Text style={styles.username}>
            {post.author.username || formatAddress(post.author.address)}
          </Text>
          <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
        </View>
        {isAuthor && (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.content}>{post.content.text}</Text>

      {post.content.media && post.content.media.length > 0 && (
        <View style={styles.mediaContainer}>
          {post.content.media.map((media, index) => (
            <View key={index} style={styles.mediaWrapper}>
              {media.type === 'image' && (
                <Image
                  source={{ uri: media.uri }}
                  style={styles.media}
                  resizeMode="cover"
                />
              )}
              {/* Add support for video and audio later */}
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAppreciate}
        >
          <Ionicons name="heart-outline" size={20} color="#2563eb" />
          <Text style={styles.actionText}>{post.appreciationCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
          <Ionicons name="chatbubble-outline" size={20} color="#2563eb" />
          <Text style={styles.actionText}>{post.commentCount}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  date: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  content: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 10,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 5,
  },
  mediaWrapper: {
    flex: 1,
    minWidth: '48%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#2563eb',
  },
});