/**
 * Narrivo Navigation - Tab + Stack Hybrid
 *
 * Structure:
 * - BottomTabs: Library | NowPlaying | Settings
 * - Each tab has its own stack for drill-down views
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';
import { AudioIcon, BookIcon, GridIcon, SettingsIcon } from '../components/Icons';
import { Book } from '../types';

// Screens
import { LibraryScreen } from '../screens/LibraryScreen';
import { ReaderScreen } from '../screens/ReaderScreen';
import { ReadAlongScreen } from '../screens/ReadAlongScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PlayerScreen } from '../screens/PlayerScreen';

// Type definitions for navigation
export type LibraryStackParamList = {
  LibraryHome: undefined;
  Reader: { book: Book };
  ReadAlong: { book: Book };
};

export type PlayerStackParamList = {
  NowPlaying: undefined;
  ReadAlong: { book: Book };
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
};

export type RootTabParamList = {
  LibraryTab: undefined;
  PlayerTab: undefined;
  SettingsTab: undefined;
};

const LibraryStack = createStackNavigator<LibraryStackParamList>();
const PlayerStack = createStackNavigator<PlayerStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// Library Stack Navigator
function LibraryStackNavigator() {
  return (
    <LibraryStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bg },
      }}
    >
      <LibraryStack.Screen name="LibraryHome" component={LibraryScreen} />
      <LibraryStack.Screen name="Reader" component={ReaderScreen} />
      <LibraryStack.Screen name="ReadAlong" component={ReadAlongScreen} />
    </LibraryStack.Navigator>
  );
}

// Player Stack Navigator
function PlayerStackNavigator() {
  return (
    <PlayerStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bg },
      }}
    >
      <PlayerStack.Screen name="NowPlaying" component={PlayerScreen} />
      <PlayerStack.Screen name="ReadAlong" component={ReadAlongScreen} />
    </PlayerStack.Navigator>
  );
}

// Settings Stack Navigator
function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bg },
      }}
    >
      <SettingsStack.Screen name="SettingsHome" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

// Tab Bar Icon Component
interface TabIconProps {
  focused: boolean;
  type: 'library' | 'player' | 'settings';
}

const TabIcon: React.FC<TabIconProps> = ({ focused, type }) => {
  const color = focused ? colors.lime : colors.gray;
  const size = 22;

  const icons = {
    library: <GridIcon size={size} color={color} />,
    player: <AudioIcon size={size} color={color} />,
    settings: <SettingsIcon size={size} color={color} />,
  };

  return (
    <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
      {icons[type]}
    </View>
  );
};

// Root Tab Navigator
export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.lime,
          tabBarInactiveTintColor: colors.gray,
        }}
      >
        <Tab.Screen
          name="LibraryTab"
          component={LibraryStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} type="library" />,
          }}
        />
        <Tab.Screen
          name="PlayerTab"
          component={PlayerStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} type="player" />,
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} type="settings" />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 65,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  tabIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconFocused: {
    backgroundColor: `${colors.lime}20`,
  },
});
