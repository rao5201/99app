import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import PaywallScreen from '../screens/PaywallScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const COLORS = {
  primary: '#6C5CE7',
  bgDark: '#0A0E27',
  bgCard: '#141937',
  textSecondary: '#5A6180',
  border: '#2A3158',
};

const ONBOARDING_KEY = '@bizpilot_onboarded';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const defaultScreenOptions = {
  headerShown: false,
};

const TAB_ICONS = {
  Dashboard: { focused: 'grid', unfocused: 'grid-outline' },
  'AI Assistant': { focused: 'chatbubble-ellipses', unfocused: 'chatbubble-ellipses-outline' },
  Analytics: { focused: 'bar-chart', unfocused: 'bar-chart-outline' },
  Projects: { focused: 'folder', unfocused: 'folder-outline' },
  Settings: { focused: 'settings', unfocused: 'settings-outline' },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...defaultScreenOptions,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.bgCard,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="AI Assistant" component={AIAssistantScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [isOnboarded, setIsOnboarded] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setIsOnboarded(value === 'true');
      } catch (error) {
        console.warn('Error reading onboarding state:', error);
        setIsOnboarded(false);
      }
    };

    checkOnboarding();
  }, []);

  if (isOnboarded === null) {
    return null;
  }

  return isOnboarded ? <MainTabs /> : <AuthStack />;
}
