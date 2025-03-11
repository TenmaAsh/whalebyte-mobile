import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { mockModerationService } from '../services/mockModerationService';
import { PostCard } from '../components/posts/PostCard';
import { ModerationQueue } from '../components/moderation/ModerationQueue';
import { ReportModal } from '../components/moderation/ReportModal';
import { Post } from '../types/post';
import { Report } from '../types/moderation';

export const TestModerationScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [testContent, setTestContent] = useState('');
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Load test data
  const loadTestData = async () => {
    try {
      await mockModerationService.resetMockData();
      const testPosts = await mockModerationService.getPosts();
      const testReports = await mockModerationService.getReports('test-sphere');
      setPosts(testPosts);
      setReports(testReports);
      Alert.alert('Success', 'Test data loaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to load test data');
    }
  };

  // Create test post
  const createTestPost = async () => {
    if (!testContent.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    try {
      const newPost = await mockModerationService.createPost(
        testContent,
        'test-sphere'
      );
      setPosts([newPost, ...posts]);
      setTestContent('');
      Alert.alert('Success', 'Test post created');
    } catch (error) {
      Alert.alert('Error', 'Failed to create test post');
    }
  };

  // Generate test report
  const generateTestReport = async () => {
    if (!selectedPost) {
      Alert.alert('Error', 'Please select a post first');
      return;
    }

    try {
      const newReport = await mockModerationService.generateTestReport({
        contentId: selectedPost.id,
        content: selectedPost,
      });
      setReports([newReport, ...reports]);
      Alert.alert('Success', 'Test report generated');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate test report');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Moderation Testing Dashboard</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={loadTestData}
        >
          <Text style={styles.buttonText}>Reset Test Data</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={testContent}
            onChangeText={setTestContent}
            placeholder="Enter test post content..."
            multiline
          />
          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={createTestPost}
          >
            <Text style={styles.buttonText}>Create Test Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Posts</Text>
        {posts.map((post) => (
          <View key={post.id} style={styles.postContainer}>
            <PostCard post={post} />
            <View style={styles.postActions}>
              <TouchableOpacity
                style={[styles.button, styles.smallButton]}
                onPress={() => {
                  setSelectedPost(post);
                  setReportModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.smallButton]}
                onPress={() => {
                  setSelectedPost(post);
                  generateTestReport();
                }}
              >
                <Text style={styles.buttonText}>Generate Test Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Moderation Queue</Text>
        <ModerationQueue sphereId="test-sphere" />
      </View>

      {selectedPost && (
        <ReportModal
          visible={reportModalVisible}
          onClose={() => {
            setReportModalVisible(false);
            setSelectedPost(null);
          }}
          contentId={selectedPost.id}
          contentType="post"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputContainer: {
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    minHeight: 80,
  },
  button: {
    backgroundColor: '#0000ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4,
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  smallButton: {
    padding: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  postContainer: {
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});