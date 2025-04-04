import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text as RNText, Image, ScrollView, StatusBar } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme'; // Import the theme
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import CustomButton from '../../components/CustomButton'; // Import CustomButton
import ModernBackground from '../../components/ModernBackground';
import { useError } from '../../context/ErrorContext';

const RegisterScreen = ({ navigation }) => {
  const { signUp } = useAuth(); // Destructure signUp from useAuth
  const { showError } = useError(); // Add error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      showError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, displayName); // Use signUp from AuthContext
      navigation.navigate('Home', { 
        showSuccess: true, 
        successMessage: 'Account created successfully!' 
      }); // Navigate to Home after successful registration
    } catch (error) {
      showError(error.message || 'Registration failed'); // Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <ScrollView contentContainerStyle={theme.commonStyles.content}>
          <View style={theme.commonStyles.logoContainer}>
            <Image
              source={require('../../../assets/icon.png')}
              style={[theme.commonStyles.logo, { width: 200, height: 200 }]}
            />
          </View>

          <View style={theme.commonStyles.card}>
            <Input
              placeholder="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              leftIcon={{ 
                type: 'material',
                name: 'person',
                color: theme.colors.text.secondary
              }}
              inputStyle={theme.commonStyles.input}
              placeholderTextColor={theme.colors.text.secondary}
              containerStyle={theme.commonStyles.inputContainer}
              editable={true}
              pointerEvents="auto"
            />
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon={{ 
                type: 'material',
                name: 'email',
                color: theme.colors.text.secondary
              }}
              inputStyle={theme.commonStyles.input}
              placeholderTextColor={theme.colors.text.secondary}
              containerStyle={theme.commonStyles.inputContainer}
              editable={true}
              pointerEvents="auto"
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={{ 
                type: 'material',
                name: 'lock',
                color: theme.colors.text.secondary
              }}
              inputStyle={theme.commonStyles.input}
              placeholderTextColor={theme.colors.text.secondary}
              containerStyle={theme.commonStyles.inputContainer}
              editable={true}
              pointerEvents="auto"
            />

            <CustomButton
              title="REGISTER"
              onPress={handleRegister}
              loading={loading}
            />
            <Button
              title="Back to Login"
              onPress={() => navigation.navigate('Login')}
              type="clear"
              titleStyle={styles.backToLoginText}
              style={styles.loginButton}
            />
          </View>
        </ScrollView>
      </ModernBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: theme.spacing.sm,
  },
  backToLoginText: {
    color: theme.colors.text.accent,
    fontSize: theme.typography.sizes.md,
  },
});

export default RegisterScreen; 