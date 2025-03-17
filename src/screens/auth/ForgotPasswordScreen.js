import React, { useState } from 'react';
import { View, Text, Alert, ImageBackground, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme'; // Import the theme
import { auth } from '../../config/firebase'; // Import Firebase auth
import { sendPasswordResetEmail } from 'firebase/auth'; // Import reset email function
import { Icon } from 'react-native-elements'; 
import CustomButton from '../../components/CustomButton'; // Import CustomButton
import ModernBackground from '../../components/ModernBackground';
import { useError } from '../../context/ErrorContext';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showError } = useError();

  const handleResetPassword = async () => {
    if (!email) {
      showError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showError('Password reset email sent!', 'success');
      navigation.navigate('Login');
    } catch (error) {
      showError(error.message || 'Failed to send reset email');
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
            <Icon name="lock-reset" size={80} color={theme.colors.text.accent} />
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={{ 
              type: 'material',
              name: 'email',
              color: theme.colors.text.secondary 
            }}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            editable={true}
            pointerEvents="auto"
          />

          <CustomButton
            title="Reset Password"
            onPress={handleResetPassword}
            loading={loading}
          />

          <CustomButton
            title="Back to Login"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.linkButton}
          />
        </ScrollView>
      </ModernBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    width: '100%',
    marginBottom: theme.spacing.lg,
    pointerEvents: 'auto',
  },
  input: {
    color: theme.colors.text.primary,
    pointerEvents: 'auto',
  },
  linkButton: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.accent,
  },
});

export default ForgotPasswordScreen; 