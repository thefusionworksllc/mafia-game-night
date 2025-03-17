import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

const CustomButton = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  style = {},
  textStyle = {},
  variant = 'primary', // primary, secondary, outline, text
  size = 'medium', // small, medium, large
  leftIcon = null,
  rightIcon = null,
  fullWidth = false,
}) => {
  // Determine gradient colors based on variant
  const getGradientColors = () => {
    if (disabled) return ['rgba(120, 120, 120, 0.2)', 'rgba(120, 120, 120, 0.2)'];
    
    switch (variant) {
      case 'secondary':
        return theme.gradients.buttonSecondary;
      case 'outline':
      case 'text':
        return ['transparent', 'transparent'];
      default:
        return theme.gradients.button;
    }
  };
  
  // Determine button styles based on variant and size
  const getButtonStyles = () => {
    const baseStyle = {
      ...styles.button,
      ...(fullWidth && styles.fullWidth),
    };
    
    // Size variations
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = theme.spacing.xs;
        baseStyle.paddingHorizontal = theme.spacing.md;
        baseStyle.borderRadius = theme.borderRadius.medium;
        break;
      case 'large':
        baseStyle.paddingVertical = theme.spacing.md;
        baseStyle.paddingHorizontal = theme.spacing.xl;
        baseStyle.borderRadius = theme.borderRadius.large;
        break;
      default: // medium
        baseStyle.paddingVertical = theme.spacing.sm;
        baseStyle.paddingHorizontal = theme.spacing.lg;
        baseStyle.borderRadius = theme.borderRadius.medium;
    }
    
    // Variant styles
    switch (variant) {
      case 'outline':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = disabled ? theme.colors.button.disabled : theme.colors.button.primary;
        break;
      case 'text':
        baseStyle.paddingHorizontal = theme.spacing.xs;
        baseStyle.paddingVertical = theme.spacing.xs;
        break;
    }
    
    return baseStyle;
  };
  
  // Determine text styles based on variant and size
  const getTextStyles = () => {
    const baseStyle = { ...styles.text };
    
    // Size variations
    switch (size) {
      case 'small':
        baseStyle.fontSize = theme.typography.sizes.sm;
        break;
      case 'large':
        baseStyle.fontSize = theme.typography.sizes.lg;
        break;
      default: // medium
        baseStyle.fontSize = theme.typography.sizes.md;
    }
    
    // Variant styles
    switch (variant) {
      case 'outline':
        baseStyle.color = disabled ? theme.colors.text.disabled : theme.colors.button.primary;
        break;
      case 'text':
        baseStyle.color = disabled ? theme.colors.text.disabled : theme.colors.button.primary;
        break;
      default:
        baseStyle.color = theme.colors.text.primary;
    }
    
    return baseStyle;
  };
  
  // Get container styles based on variant
  const getContainerStyles = () => {
    const baseStyle = { ...styles.container };
    
    if (variant === 'text') {
      return { ...baseStyle, ...theme.shadows.small };
    }
    
    if (variant === 'outline') {
      return { ...baseStyle, ...theme.shadows.small };
    }
    
    return { ...baseStyle, ...theme.shadows.medium };
  };
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyles(), style]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[getButtonStyles()]}
      >
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'text' ? theme.colors.button.primary : theme.colors.text.primary} 
          />
        ) : (
          <View style={styles.contentContainer}>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <Text style={[getTextStyles(), textStyle]}>{title}</Text>
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    marginVertical: theme.spacing.xs,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: theme.typography.weights.semibold,
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: theme.spacing.xs,
  },
  iconRight: {
    marginLeft: theme.spacing.xs,
  },
});

export default CustomButton; 