import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Alert, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  ScrollView,
  TouchableOpacity,
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
import { LinearGradient } from 'expo-linear-gradient';
import { useError } from '../context/ErrorContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const JoinGameScreen = ({ navigation }) => {
  const [gameCode, setGameCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const { showError } = useError();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleJoinGame = async () => {
    if (!user) {
      showError('You need to log in to join a game', 'warning');
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

    if (!gameCode || gameCode.length !== 6) {
      showError('Please enter a valid 6-character game code', 'warning');
      return;
    }

    setLoading(true);
    try {
      await gameService.joinGame(gameCode);
      
      // Fetch game data to get player counts
      const gameData = await gameService.getGameData(gameCode);
      const settings = gameData?.settings || {};
      
      navigation.navigate('GameLobby', {
        gameCode: gameCode.toUpperCase(),
        isHost: false,
        totalPlayers: settings.totalPlayers || 0,
        mafiaCount: settings.mafiaCount || 0,
        detectiveCount: settings.detectiveCount || 0,
        doctorCount: settings.doctorCount || 0
      });
    } catch (error) {
      showError(error.message || 'Failed to join game');
    } finally {
      setLoading(false);
    }
  };

  const formatGameCode = (code) => {
    // Format the game code with spaces for better readability
    if (code.length <= 3) {
      return code;
    } else {
      return `${code.substring(0, 3)} ${code.substring(3)}`;
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
            contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + theme.spacing.md }]}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View 
              style={[
                styles.welcomeSection,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              <Text style={styles.title}>Join Game</Text>
              <Text style={styles.subtitle}>
                Enter a 6-digit game code to join an existing game
              </Text>
            </Animated.View>

            <Animated.View 
              style={[
                styles.formContainer,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              <LinearGradient
                colors={['rgba(30, 30, 50, 0.8)', 'rgba(20, 20, 35, 0.9)']}
                style={styles.formGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.codeInputContainer}>
                  <Text style={styles.inputLabel}>Game Code</Text>
                  <Input
                    placeholder="Enter 6-digit code"
                    value={formatGameCode(gameCode)}
                    onChangeText={(text) => setGameCode(text.replace(/\s/g, ''))}
                    keyboardType={Platform.OS === 'web' ? 'numeric' : 'number-pad'}
                    maxLength={7} // 6 digits + 1 space
                    leftIcon={{ 
                      type: 'material',
                      name: 'games',
                      color: theme.colors.primary,
                      size: 24 
                    }}
                    inputStyle={{
                      color: theme.colors.text.primary,
                      fontSize: theme.typography.sizes.xl,
                      fontWeight: theme.typography.weights.bold,
                      textAlign: 'center',
                      letterSpacing: 8,
                    }}
                    inputContainerStyle={{
                      borderBottomColor: theme.colors.primary,
                      borderBottomWidth: 2,
                    }}
                    containerStyle={{
                      paddingHorizontal: 0,
                    }}
                    placeholderTextColor={theme.colors.text.secondary}
                    editable={true}
                    pointerEvents="auto"
                  />
                </View>

                {user ? (
                  <View style={styles.userInfoContainer}>
                    <Icon name="person" size={20} color={theme.colors.success} />
                    <Text style={styles.userInfoText}>
                      Joining as: <Text style={styles.userName}>{user.displayName || user.email}</Text>
                    </Text>
                  </View>
                ) : (
                  <View style={styles.userInfoContainer}>
                    <Icon name="warning" size={20} color={theme.colors.warning} />
                    <Text style={styles.userInfoText}>
                      You need to be logged in to join a game
                    </Text>
                    <TouchableOpacity 
                      onPress={() => navigation.navigate('Login')}
                      style={styles.loginLink}
                    >
                      <Text style={styles.loginLinkText}>Click here to login</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.buttonContainer}>
                  <CustomButton
                    title="Join Game"
                    onPress={handleJoinGame}
                    loading={loading}
                    disabled={gameCode.length !== 6 || loading}
                    style={styles.joinButton}
                    leftIcon={<Icon name="login" size={20} color={theme.colors.text.primary} />}
                  />
                  <CustomButton
                    title="Back to Home"
                    onPress={() => navigation.navigate('Home')}
                    variant="outline"
                    style={styles.backButton}
                    leftIcon={<Icon name="home" size={20} color={theme.colors.text.accent} />}
                  />
                </View>
              </LinearGradient>
            </Animated.View>

            <Animated.View 
              style={[
                styles.instructionsContainer,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              <View style={styles.instructionItem}>
                <Icon name="info" size={20} color={theme.colors.info} />
                <Text style={styles.instructionText}>
                  Ask the game host for the 6-digit code
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Icon name="group" size={20} color={theme.colors.info} />
                <Text style={styles.instructionText}>
                  Join the lobby and wait for the host to start the game
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Icon name="security" size={20} color={theme.colors.info} />
                <Text style={styles.instructionText}>
                  Your role will be assigned when the game begins
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
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
    alignItems: 'center',
  },
  welcomeSection: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
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
    width: CARD_WIDTH,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
    marginBottom: theme.spacing.xl,
  },
  formGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
  },
  codeInputContainer: {
    marginBottom: theme.spacing.md,
    pointerEvents: 'auto',
    width: '100%',
  },
  inputLabel: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  userInfoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  userName: {
    color: theme.colors.text.accent,
    fontWeight: theme.typography.weights.bold,
  },
  buttonContainer: {
    width: '100%',
  },
  joinButton: {
    marginBottom: theme.spacing.md,
  },
  backButton: {
  },
  instructionsContainer: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  instructionText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  loginLink: {
    marginTop: theme.spacing.xs,
    alignSelf: 'center',
  },
  loginLinkText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
    textDecorationLine: 'underline',
  },
});

export default JoinGameScreen;
