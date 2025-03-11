import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './src/contexts/AuthContext';
import { BlockchainProvider } from './src/contexts/BlockchainContext';
import { PostProvider } from './src/contexts/PostContext';
import { ModerationProvider } from './src/contexts/ModerationContext';
import { TestModerationScreen } from './src/screens/TestModerationScreen';
import { CONFIG } from './src/config';

const Tab = createBottomTabNavigator();

const AppContent: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Spheres') {
            iconName = focused ? 'globe' : 'globe-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Moderation') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: CONFIG.UI.THEME.PRIMARY_COLOR,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Moderation"
        component={TestModerationScreen}
        options={{
          title: 'Test Moderation',
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <BlockchainProvider>
            <PostProvider>
              <ModerationProvider>
                <AppContent />
              </ModerationProvider>
            </PostProvider>
          </BlockchainProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}