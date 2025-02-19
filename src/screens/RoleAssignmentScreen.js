import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

const RoleAssignmentScreen = () => {
  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={theme.commonStyles.content}
      resizeMode="cover"
    >
      <LinearGradient
        colors={theme.gradients.background}
        style={theme.commonStyles.container}
      >
        <View style={theme.commonStyles.content}>
          <View style={theme.commonStyles.card}>
            <Text style={theme.commonStyles.title}>Role Assignment</Text>
            <Text style={theme.commonStyles.subtitle}>Assigned Roles:</Text>
            {/* Display assigned roles here */}
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default RoleAssignmentScreen; 