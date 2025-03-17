import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Alert, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Input } from 'react-native-elements';
import theme from '../theme';
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/gameService';
import BottomNavigation from '../components/BottomNavigation';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModernBackground from '../components/ModernBackground';

const JoinGameScreen = ({ navigation }) => {
  const [gameCode, setGameCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const handleJoinGame = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'You need to log in to join a game.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    if (gameCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit game code');
      return;
    }

    setLoading(true);
    try {
      await gameService.joinGame(gameCode);
      navigation.navigate('GameLobby', {
        gameCode: gameCode.toUpperCase(),
        isHost: false,
      });
    } catch (error) {
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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.contentContainer}>
              <View style={styles.welcomeSection}>
                <Text style={styles.title}>Join Game</Text>
                <Text style={styles.subtitle}>
                  Enter a 6-digit game code to join an existing game
                </Text>
              </View>

              <View style={styles.formContainer}>
                <Input
                  placeholder="Enter 6-digit Game Code"
                  value={gameCode}
                  onChangeText={setGameCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  inputStyle={styles.input}
                  inputContainerStyle={styles.inputContainer}
                  leftIcon={
                    <Icon name="games" size={24} color={theme.colors.primary} />
                  }
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleJoinGame}
                />

                <View style={styles.buttonContainer}>
                  <CustomButton
                    title="Join Game"
                    onPress={handleJoinGame}
                    loading={loading}
                    disabled={gameCode.length !== 6 || loading}
                    style={styles.joinButton}
                  />
                  <CustomButton
                    title="Back to Home"
                    onPress={() => navigation.navigate('Home')}
                    variant="outline"
                    style={styles.backButton}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="JoinGame" />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: theme.spacing.horizontalPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    // Text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'center',
    letterSpacing: 8,
  },
  buttonContainer: {
    width: '100%',
  },
  joinButton: {
    marginTop: theme.spacing.md,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});

export default JoinGameScreen;
