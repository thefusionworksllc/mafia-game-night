import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';

const ErrorToast = ({ message, visible, onHide, type = 'error' }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Auto hide after 4 seconds
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);
  
  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onHide) onHide();
    });
  };
  
  if (!visible) return null;
  
  // Choose icon and background color based on type
  let iconName = 'error-outline';
  let backgroundColor = theme.colors.error;
  
  if (type === 'success') {
    iconName = 'check-circle';
    backgroundColor = theme.colors.success;
  } else if (type === 'warning') {
    iconName = 'warning';
    backgroundColor = theme.colors.warning;
  } else if (type === 'info') {
    iconName = 'info';
    backgroundColor = theme.colors.info;
  }
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0]
            })
          }]
        }
      ]}
    >
      <View style={[styles.toast, { backgroundColor }]}>
        <Icon name={iconName} size={24} color="#fff" style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={hideToast}>
          <Icon name="close" size={20} color="#fff" style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 10,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    width: '90%',
    maxWidth: 500,
    ...theme.shadows.medium,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  message: {
    flex: 1,
    color: '#fff',
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  closeIcon: {
    padding: 4,
  }
});

export default ErrorToast; 