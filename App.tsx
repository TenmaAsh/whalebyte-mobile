import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { BlockchainProvider } from './src/contexts/BlockchainContext';
import { PostProvider } from './src/contexts/PostContext';
import { SpheresScreen } from './src/screens/SpheresScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { ActivityIndicator, View } from 'react-native';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Spheres') {
            iconName = focused ? 'globe' : 'globe-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Spheres" component={SpheresScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
    </Tab.Navigator>
  );
};

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BlockchainProvider>
          <PostProvider>
            <AppContent />
          </PostProvider>
        </BlockchainProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}