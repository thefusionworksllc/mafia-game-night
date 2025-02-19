import React from 'react';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

const CustomButton = ({ title, onPress, loading, style }) => (
  <LinearGradient
    colors={theme.gradients.button}
    style={[theme.commonStyles.buttonGradient, style]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
  >
    <Button
      title={title}
      onPress={onPress}
      loading={loading}
      buttonStyle={theme.commonStyles.buttonContent}
      titleStyle={theme.commonStyles.buttonText}
      containerStyle={theme.commonStyles.buttonContainer}
    />
  </LinearGradient>
);

export default CustomButton; 