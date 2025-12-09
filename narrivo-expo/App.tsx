import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { audioService } from './src/services/audioService';
import { useProStore } from './src/store/proStore';

export default function App() {
  const loadProStatus = useProStore((s) => s.loadProStatus);

  // Initialize services on app start
  useEffect(() => {
    audioService.setup();
    loadProStatus();
  }, [loadProStatus]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />
      <RootNavigator />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
