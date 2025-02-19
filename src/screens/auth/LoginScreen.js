import React, { useState } from 'react';
import { View, Text as RNText, Alert, ImageBackground, Image, StyleSheet, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme'; // Import the theme
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import CustomButton from '../../components/CustomButton'; // Import CustomButton
import LoadingSpinner from '../../components/LoadingSpinner'; // Import LoadingSpinner

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth(); // Destructure signIn from useAuth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    console.log("Logging in with email:", email); // Debug message
    try {
      await signIn(email, password); // Use signIn from AuthContext
     // Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('Home'); // Navigate to Home after successful login
    } catch (error) {
      console.error("Login error:", error); // Debug message
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
        <ScrollView contentContainerStyle={theme.commonStyles.content}>
          <View style={theme.commonStyles.logoContainer}>
            <Image
              source={require('../../../assets/icon.png')}
              style={[theme.commonStyles.logo, { width: 200, height: 200 }]}
            />
            <RNText style={styles.welcomeText}>Let the Game Begin!</RNText>
          </View>

          <View style={theme.commonStyles.card}>
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
            />

            <CustomButton
              title="LOGIN"
              onPress={handleLogin}
              loading={loading}
            />
            <CustomButton
              title="REGISTER"
              onPress={() => navigation.navigate('Register')}
              style={styles.registerButton}
            />
            <Button
              title="Forgot Password?"
              onPress={() => navigation.navigate('ForgotPassword')}
              type="clear"
              titleStyle={styles.forgotPasswordText}
              containerStyle={styles.forgotPasswordContainer}
            />
          </View>
          {loading && <LoadingSpinner />} 
        </ScrollView>
      </LinearGradient>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  registerButton: {
    marginTop: theme.spacing.sm,
  },
  forgotPasswordText: {
    color: theme.colors.text.accent,
    fontSize: theme.typography.sizes.md,
  },
  forgotPasswordContainer: {
    marginTop: theme.spacing.sm,
  },
});

export default LoginScreen; 