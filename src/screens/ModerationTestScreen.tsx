import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useModeration } from '../contexts/ModerationContext';
import { usePost } from '../contexts/PostContext';
import { PostCard } from '../components/posts/PostCard';
import { ModerationQueue } from '../components/moderation/ModerationQueue';
import { CreatePostModal } from '../components/posts/CreatePostModal';

export const ModerationTestScreen: React.FC = () => {
  const [createPostVisible, setCreatePostVisible] = useState(false);
  const { posts, loadPosts, error: postError } = usePost();
  const {
    moderationStats,
    error: moderationError,
  } = useModeration();

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = () => {
    setCreatePostVisible(true);
  };

  const handleError = () => {
    if (postError) {
      Alert.alert('Post Error', postError);
    }
    if (moderationError) {
      Alert.alert('Moderation Error', moderationError);
    }
  };

  useEffect(() => {
    if (postError || moderationError) {
      handleError();
    }
  }, [postError, moderationError]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Moderation Test Dashboard</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePost}
        >
          <Text style={styles.createButtonText}>Create Test Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Moderation Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {moderationStats?.totalReports || 0}
            </Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {moderationStats?.pendingReports || 0}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {moderationStats?.resolvedReports || 0}
            </Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Posts</Text>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Moderation Queue</Text>
        <ModerationQueue sphereId="test-sphere" />
      </View>

      <CreatePostModal
        visible={createPostVisible}
        onClose={() => setCreatePostVisible(false)}
        sphereId="test-sphere"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#0000ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0000ff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
  },
});