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

// Helper for creating neumorphic effect (modern raised UI elements)
const createNeumorphicEffect = (bgColor = colors.surface, raised = true) => {
  const type = raised ? 'convex' : 'concave';
  const lightShadow = 'rgba(255, 255, 255, 0.07)';
  const darkShadow = 'rgba(0, 0, 0, 0.15)';

  return Platform.select({
    ios: {
      backgroundColor: bgColor,
      shadowColor: type === 'convex' ? lightShadow : darkShadow,
      shadowOffset: { width: -4, height: -4 },
      shadowOpacity: 1,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    android: {
      backgroundColor: bgColor,
      elevation: 6,
    },
    default: {
      backgroundColor: bgColor,
      shadowColor: type === 'convex' ? lightShadow : darkShadow,
      shadowOffset: { width: -4, height: -4 },
      shadowOpacity: 1,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
  });
};

// Export the completed theme object
const theme = {
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
  
  // Neumorphic effects
  neumorphic: {
    raised: createNeumorphicEffect(colors.surface, true),
    pressed: createNeumorphicEffect(colors.surface, false),
    subtle: {
      ...createNeumorphicEffect(colors.surface, true),
      shadowOpacity: 0.5,
      borderWidth: 0.5,
    },
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
  
  // Animations settings
  animation: {
    timingFast: 200,
    timingNormal: 350,
    timingSlow: 500,
    springConfig: {
      tension: 40,
      friction: 7,
    },
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
    
    // Neumorphic card (modern raised effect)
    cardNeumorphic: {
      borderRadius: 16,
      padding: spacing.lg,
      marginVertical: spacing.md,
      ...createNeumorphicEffect(colors.card.background, true),
    },
    
    // Dynamic card that can be used with different gradient backgrounds
    cardDynamic: {
      borderRadius: 16,
      padding: spacing.lg,
      marginVertical: spacing.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    
    // Text styles with enhanced readability
    title: {
      fontSize: typography.sizes.xxl,
      fontWeight: typography.weights.bold,
      color: colors.text.primary,
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

    // Modern translucent tab bar
    modernTabBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 60,
      ...createGlassEffect(0.08),
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    
    // Modern tab item
    modernTabItem: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    
    // Modern tab indicator
    modernTabIndicator: {
      position: 'absolute',
      bottom: 0,
      height: 3,
      width: '20%',
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    
    // Modern floating button
    floatingButton: {
      position: 'absolute',
      bottom: spacing.xl,
      right: spacing.xl,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...createShadow(8),
    },
    
    // Modern card styles
    modernCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: spacing.lg,
      marginVertical: spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
      ...createShadow(4),
    },
    
    // Gradient card with border
    gradientCardWithBorder: {
      borderRadius: 16,
      padding: spacing.lg,
      marginVertical: spacing.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    
    // Modern action button - more tactile
    actionButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...createShadow(3),
    },
    
    // Outlined action button
    actionButtonOutlined: {
      backgroundColor: 'transparent',
      borderRadius: 12,
      paddingVertical: spacing.md - 1, // -1 to account for border
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    
    // Modern header with slight gradient
    modernHeader: {
      paddingTop: spacing.safeTop + spacing.md,
      paddingBottom: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    
    // Input with animated label
    inputAnimated: {
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      height: 56,
      paddingHorizontal: spacing.lg,
      color: colors.text.primary,
      fontSize: typography.sizes.md,
    },
    
    // Modern slider UI element
    slider: {
      height: 40,
      width: '100%',
    },
    
    // Value display in modern UI
    valueDisplay: {
      fontSize: 28,
      fontWeight: typography.weights.semibold,
      color: colors.text.primary,
      textAlign: 'center',
    },
    
    // Section label with accent
    sectionLabel: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
      color: colors.text.accent,
      marginBottom: spacing.sm,
    },
    
    // Circle icon container for better visual hierarchy
    circleIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
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