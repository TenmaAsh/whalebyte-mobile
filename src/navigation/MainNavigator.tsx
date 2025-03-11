import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TestModerationScreen } from '../screens/TestModerationScreen';

const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Test') {
            iconName = focused ? 'bug' : 'bug-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0000ff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Test"
        component={TestModerationScreen}
        options={{
          title: 'Test Moderation',
        }}
      />
    </Tab.Navigator>
  );
};