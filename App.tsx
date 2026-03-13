import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { I18nProvider } from './src/i18n';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <I18nProvider>
        <HomeScreen />
      </I18nProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

