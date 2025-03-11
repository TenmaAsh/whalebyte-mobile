import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';

// Providers
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { BlockchainProvider } from './src/contexts/BlockchainContext';
import { PostProvider } from './src/contexts/PostContext';
import { TokenProvider } from './src/contexts/TokenContext';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Auth = createBottomTabNavigator();

const AuthNavigator = () => (
  <Auth.Navigator screenOptions={{ headerShown: false }}>
    <Auth.Screen 
      name="Login" 
      component={LoginScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="log-in-outline" size={size} color={color} />
        ),
      }}
    />
    <Auth.Screen 
      name="Register" 
      component={RegisterScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-add-outline" size={size} color={color} />
        ),
      }}
    />
  </Auth.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Wallet" 
      component={WalletScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="wallet-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <BlockchainProvider>
            <TokenProvider>
              <PostProvider>
                <AppContent />
              </PostProvider>
            </TokenProvider>
          </BlockchainProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}