import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const screenWidth = Math.min(width, height);
const screenHeight = Math.max(width, height);

// Base spacing unit
const baseUnit = 4;

// Responsive spacing that scales slightly with screen size
const getResponsiveSpacing = (multiplier) => {
  const scaleFactor = screenWidth / 375; // 375 is base width (iPhone X)
  const scaledValue = baseUnit * multiplier * Math.min(scaleFactor, 1.3);
  return Math.round(scaledValue);
};

export const spacing = {
  // Fixed spacing
  xs: baseUnit,
  sm: baseUnit * 2,
  md: baseUnit * 4,
  lg: baseUnit * 6,
  xl: baseUnit * 8,
  xxl: baseUnit * 12,
  xxxl: baseUnit * 16,
  
  // Responsive spacing
  get tiny() { return getResponsiveSpacing(1); },
  get small() { return getResponsiveSpacing(2); },
  get medium() { return getResponsiveSpacing(4); },
  get large() { return getResponsiveSpacing(6); },
  get xlarge() { return getResponsiveSpacing(8); },
  get xxlarge() { return getResponsiveSpacing(12); },
  
  // Screen dimensions
  screenWidth,
  screenHeight,
  
  // Safe areas
  safeTop: Platform.OS === 'ios' ? 44 : 24,
  safeBottom: Platform.OS === 'ios' ? 34 : 16,
  
  // Layout
  headerHeight: 56,
  bottomNavHeight: 64,
  
  // Helpers
  get horizontalPadding() { return getResponsiveSpacing(5); },
  get verticalPadding() { return getResponsiveSpacing(4); },
}; 