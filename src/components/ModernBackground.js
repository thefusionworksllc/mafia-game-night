import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

const ModernBackground = ({ children, style, withAnimation = true }) => {
  const insets = useSafeAreaInsets();
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    if (withAnimation) {
      // Create a subtle animation for the gradient
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 15000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 15000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [withAnimation]);

  // Interpolate the animated value to create a subtle shift in the gradient
  const gradientStart = withAnimation
    ? animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [{ x: 0, y: 0 }, { x: 0.1, y: 0.1 }],
      })
    : { x: 0, y: 0 };

  const gradientEnd = withAnimation
    ? animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [{ x: 1, y: 1 }, { x: 0.9, y: 0.9 }],
      })
    : { x: 1, y: 1 };

  return (
    <View style={[styles.container, style]}>
      <ImageBackground
        source={require('../../assets/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay gradient to enhance the background image */}
        <LinearGradient
          colors={theme.gradients.backgroundOverlay}
          style={styles.overlayGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        
        {/* Main animated gradient */}
        {withAnimation ? (
          <Animated.View style={styles.animatedGradientContainer}>
            <LinearGradient
              colors={theme.gradients.backgroundAnimated}
              style={styles.gradient}
              start={gradientStart}
              end={gradientEnd}
            />
          </Animated.View>
        ) : (
          <LinearGradient
            colors={theme.gradients.background}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        )}
        
        {/* Content container with safe area insets */}
        <View 
          style={[
            styles.contentContainer,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            }
          ]}
        >
          {children}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlayGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  animatedGradientContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    zIndex: 3,
    paddingBottom: theme.spacing.bottomNavHeight,
  },
});

export default ModernBackground; 