import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AnimeProvider } from './src/context/AnimeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AnimeProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AnimeProvider>
  );
}
