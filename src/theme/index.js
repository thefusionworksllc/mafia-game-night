import { colors, gradients } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { Platform, StatusBar } from 'react-native';

// Helper for creating consistent shadows
const createShadow = (elevation = 2) => {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.1 + (elevation * 0.03),
      shadowRadius: elevation * 0.8,
    },
    android: {
      elevation: elevation,
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.1 + (elevation * 0.03),
      shadowRadius: elevation * 0.8,
      elevation: elevation,
    },
  });
};

// Helper for creating glass effect
const createGlassEffect = (opacity = 0.1) => {
  return {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(10px)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  };
};

export const theme = {
  colors,
  gradients,
  typography,
  spacing,
  
  // Shadows with different intensities
  shadows: {
    small: createShadow(2),
    medium: createShadow(4),
    large: createShadow(8),
    extraLarge: createShadow(16),
  },
  
  // Glass effects
  glass: {
    light: createGlassEffect(0.08),
    medium: createGlassEffect(0.12),
    heavy: createGlassEffect(0.18),
  },
  
  // Border radius
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    xl: 24,
    xxl: 32,
    round: 9999,
  },
  
  // Common styles that can be reused across screens
  commonStyles: {
    // Base container for screens
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    
    // Background image style
    backgroundImage: {
      flex: 1,
      width: '100%',
    },
    
    // Gradient container
    gradientContainer: {
      flex: 1,
    },
    
    // Content container with padding
    content: {
      flex: 1,
      padding: spacing.horizontalPadding,
      paddingBottom: spacing.bottomNavHeight + spacing.safeBottom,
    },
    
    // Scrollable content
    scrollContainer: {
      flex: 1,
    },
    
    scrollContentContainer: {
      padding: spacing.horizontalPadding,
      paddingBottom: spacing.bottomNavHeight + spacing.safeBottom + spacing.lg,
      paddingTop: spacing.md,
    },
    
    // Card styles with updated look
    card: {
      backgroundColor: colors.card.background,
      borderRadius: 16,
      padding: spacing.lg,
      marginVertical: spacing.md,
      ...createShadow(4),
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    
    cardElevated: {
      backgroundColor: colors.card.background,
      borderRadius: 16,
      padding: spacing.lg,
      marginVertical: spacing.md,
      ...createShadow(8),
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    
    // Glass card with blur effect
    cardGlass: {
      borderRadius: 16,
      padding: spacing.lg,
      marginVertical: spacing.md,
      ...createGlassEffect(0.1),
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
    },
    
    // Gradient card
    cardGradient: {
      borderRadius: 16,
      padding: spacing.md,
      marginVertical: spacing.sm,
      overflow: 'hidden',
    },
    
    // Text styles with enhanced readability
    title: {
      fontSize: typography.sizes.xxl,
      fontWeight: typography.weights.bold,
      color: colors.text.accent,
      textAlign: 'center',
      marginVertical: spacing.lg,
      // Text shadow for better readability
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    
    subtitle: {
      fontSize: typography.sizes.md,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    
    // Button container
    buttonContainer: {
      marginTop: spacing.lg,
    },
    
    // Back button style
    backButton: {
      marginTop: spacing.md,
    },
    
    // Legacy styles (kept for backward compatibility)
    safeContainer: {
      flex: 1,
      paddingTop: spacing.safeTop,
      paddingBottom: spacing.safeBottom,
    },
    
    logoContainer: {
      alignItems: 'center',
      marginBottom: spacing.xxlarge,
    },
    
    logo: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: spacing.large,
    },
    
    buttonGradient: {
      borderRadius: 12,
      marginVertical: spacing.small,
      overflow: 'hidden',
      ...createShadow(3),
    },
    
    buttonContent: {
      backgroundColor: 'transparent',
      paddingVertical: spacing.medium,
      borderRadius: 12,
    },
    
    buttonText: {
      color: colors.text.primary,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
      letterSpacing: 0.5,
    },
    
    input: {
      color: colors.text.primary,
      fontSize: typography.sizes.md,
      paddingHorizontal: spacing.medium,
      paddingVertical: spacing.small,
      backgroundColor: colors.input.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.input.border,
      pointerEvents: 'auto',
      width: '100%',
    },
    
    inputContainer: {
      marginBottom: spacing.medium,
      paddingHorizontal: 0,
      pointerEvents: 'auto',
    },
    
    inputLabel: {
      color: colors.text.secondary,
      fontSize: typography.sizes.sm,
      marginBottom: spacing.xs,
      pointerEvents: 'auto',
    },
    
    // Section headers
    sectionHeader: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
      color: colors.text.primary,
      marginBottom: spacing.small,
      marginTop: spacing.large,
    },
    
    sectionSubheader: {
      fontSize: typography.sizes.md,
      color: colors.text.secondary,
      marginBottom: spacing.medium,
    },
    
    // Row layout
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    rowAround: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    
    bodyText: {
      fontSize: typography.sizes.md,
      color: colors.text.primary,
      lineHeight: typography.lineHeights.normal,
    },
    
    captionText: {
      fontSize: typography.sizes.sm,
      color: colors.text.secondary,
    },
    
    // Status indicators
    statusSuccess: {
      color: colors.success,
    },
    
    statusError: {
      color: colors.error,
    },
    
    statusWarning: {
      color: colors.warning,
    },
    
    statusInfo: {
      color: colors.info,
    },
    
    // Divider
    divider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      marginVertical: spacing.medium,
    },
    
    // Badge
    badge: {
      paddingHorizontal: spacing.small,
      paddingVertical: spacing.xs / 2,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    
    badgeText: {
      color: colors.text.primary,
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.bold,
    },
  },
};

export default theme; 