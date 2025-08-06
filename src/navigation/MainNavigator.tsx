import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { GenreDetailScreen } from '../screens/GenreDetailScreen';
import { MeditationPlayerScreen } from '../screens/MeditationPlayerScreen';
import { MeditationPreparationScreen } from '../screens/MeditationPreparationScreen';
import { colors } from '../styles/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 34, // Safe area padding for iPhone home indicator
          height: 90, // Increased height to accommodate safe area
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Meditations' }}
      />
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen}
        options={{ title: 'Library' }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen 
        name="GenreDetail" 
        component={GenreDetailScreen}
        options={{ 
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ 
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="MeditationPreparation" 
        component={MeditationPreparationScreen}
        options={{ 
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="MeditationPlayer" 
        component={MeditationPlayerScreen}
        options={{ 
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};