export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    display: 48,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  fontFamily: {
    // Default system fonts - keep these for compatibility
    regular: 'System',
    medium: 'System',
    bold: 'System',
    
    // Modern font suggestions for future implementation
    // Option 1: Inter (clean, modern, highly readable)
    // regular: 'Inter-Regular',
    // medium: 'Inter-Medium',
    // semibold: 'Inter-SemiBold',
    // bold: 'Inter-Bold',
    
    // Option 2: SF Pro Text / SF Pro Display (iOS-style)
    // display: 'SF-Pro-Display-Regular',
    // displayBold: 'SF-Pro-Display-Bold',
    // text: 'SF-Pro-Text-Regular',
    // textMedium: 'SF-Pro-Text-Medium',
  },
  
  // Letter spacing for different contexts
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    buttons: 0.8, // More space for buttons
    title: 0.2,   // Slight spacing for titles
  },
  
  // Helper function to get a consistent text style
  getTextStyle: (size = 'md', weight = 'regular', color = 'primary') => {
    return {
      fontSize: typography.sizes[size],
      fontWeight: typography.weights[weight],
      fontFamily: typography.fontFamily.regular,
      letterSpacing: size === 'xs' || size === 'sm' ? 0.25 : 0,
      // Additional modern text features
      includeFontPadding: false, // Removes extra padding in Android
    };
  }
}; 