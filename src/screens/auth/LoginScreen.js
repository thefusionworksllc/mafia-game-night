import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Alert, 
  ImageBackground, 
  Image, 
  StyleSheet, 
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme'; // Import the theme
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import CustomButton from '../../components/CustomButton'; // Import CustomButton
import LoadingSpinner from '../../components/LoadingSpinner'; // Import LoadingSpinner
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModernBackground from '../../components/ModernBackground';

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth(); // Destructure signIn from useAuth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    console.log("Logging in with email:", email); // Debug message
    try {
      await signIn(email, password); // Use signIn from AuthContext
      navigation.navigate('Home'); // Navigate to Home after successful login
    } catch (error) {
      console.error("Login error:", error); // Debug message
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView 
            style={theme.commonStyles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/icon.png')}
                style={styles.logo}
              />
              <Text style={styles.welcomeText}>Let the Game Begin!</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
              
              <View style={styles.inputContainer}>
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  leftIcon={{ 
                    type: 'material',
                    name: 'email',
                    color: theme.colors.text.secondary,
                    size: 20 
                  }}
                  inputStyle={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.sizes.md,
                  }}
                  inputContainerStyle={{
                    borderBottomColor: theme.colors.primary,
                    borderBottomWidth: 1,
                  }}
                  containerStyle={{
                    paddingHorizontal: 0,
                    marginHorizontal: 0,
                  }}
                  placeholderTextColor={theme.colors.text.secondary}
                  editable={true}
                  pointerEvents="auto"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Input
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  leftIcon={{ 
                    type: 'material',
                    name: 'lock',
                    color: theme.colors.text.secondary,
                    size: 20 
                  }}
                  inputStyle={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.sizes.md,
                  }}
                  inputContainerStyle={{
                    borderBottomColor: theme.colors.primary,
                    borderBottomWidth: 1,
                  }}
                  containerStyle={{
                    paddingHorizontal: 0,
                    marginHorizontal: 0,
                  }}
                  placeholderTextColor={theme.colors.text.secondary}
                  editable={true}
                  pointerEvents="auto"
                />
              </View>

              <CustomButton
                title="LOGIN"
                onPress={handleLogin}
                loading={loading}
                leftIcon={<Icon name="login" size={20} color={theme.colors.text.primary} />}
                fullWidth
              />
              
              <View style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText} onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password?</Text>
              </View>
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <CustomButton
                title="CREATE ACCOUNT"
                onPress={() => navigation.navigate('Register')}
                variant="outline"
                style={styles.registerButton}
                leftIcon={<Icon name="person-add" size={20} color={theme.colors.text.accent} />}
                fullWidth
              />
            </View>
            {loading && <LoadingSpinner />} 
          </ScrollView>
        </KeyboardAvoidingView>
      </ModernBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    padding: theme.spacing.horizontalPadding,
    paddingBottom: theme.spacing.safeBottom + theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.md,
  },
  welcomeText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    // Text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.weights.medium,
  },
  inputContainerStyle: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
    width: '90%',
    pointerEvents: 'auto',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  forgotPasswordText: {
    color: theme.colors.text.accent,
    fontSize: theme.typography.sizes.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.sm,
  },
  registerButton: {
    marginTop: theme.spacing.sm,
  },
});

export default LoginScreen; 