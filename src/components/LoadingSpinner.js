import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import theme from '../theme';

const LoadingSpinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={theme.colors.text.accent} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
});

export default LoadingSpinner; 