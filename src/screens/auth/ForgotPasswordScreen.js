import React, { useState } from 'react';
import { View, Text, Alert, ImageBackground, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme'; // Import the theme
import { auth } from '../../config/firebase'; // Import Firebase auth
import { sendPasswordResetEmail } from 'firebase/auth'; // Import reset email function
import { Icon } from 'react-native-elements'; 
import { Image } from 'react-native';
import CustomButton from '../../components/CustomButton'; // Import CustomButton

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/background.png')}
      style={theme.commonStyles.content}
      resizeMode="cover"
    >
      <LinearGradient
        colors={theme.gradients.background}
        style={theme.commonStyles.container}
      >
                
        <View style={theme.commonStyles.card}>
          <Icon name="lock-reset" size={80} color={theme.colors.text.accent} />
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
            leftIcon={
              <Icon name="email" size={24} color={theme.colors.text.secondary} />
            }
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />

          <CustomButton
            title="Reset Password"
            onPress={handleResetPassword}
            loading={loading}
          />

          <Button
            title="Back to Login"
            onPress={() => navigation.goBack()}
            type="clear"
            titleStyle={styles.linkButton}

          />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
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
  },
  input: {
    color: theme.colors.text.primary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text.primary,
  },
  linkButton: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.accent,
  },
});

export default ForgotPasswordScreen; 