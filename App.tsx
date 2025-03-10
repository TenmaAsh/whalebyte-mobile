import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { BlockchainProvider } from './src/contexts/BlockchainContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SpheresScreen from './src/screens/SpheresScreen';
import WalletScreen from './src/screens/WalletScreen';
import SphereDetailsScreen from './src/screens/SphereDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SpheresStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SpheresMain" 
        component={SpheresScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SphereDetails" 
        component={SphereDetailsScreen}
        options={{ 
          headerTitle: 'Sphere Details',
          headerBackTitle: 'Back'
        }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Spheres" component={SpheresStack} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <BlockchainProvider>
      <NavigationContainer>
        <TabNavigator />
        <StatusBar style="auto" />
        <Toast />
      </NavigationContainer>
    </BlockchainProvider>
  );
}