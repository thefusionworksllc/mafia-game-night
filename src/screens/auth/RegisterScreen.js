import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text as RNText, Image, ImageBackground, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme'; // Import the theme
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import CustomButton from '../../components/CustomButton'; // Import CustomButton

const RegisterScreen = ({ navigation }) => {
  const { signUp } = useAuth(); // Destructure signUp from useAuth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, displayName); // Use signUp from AuthContext
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login'); // Navigate to Login after successful registration
    } catch (error) {
      Alert.alert('Error', error.message); // Show error message
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
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
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