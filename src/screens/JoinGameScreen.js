import React, { useState, useEffect, useRef } from 'react';
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
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

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
      
      if (Platform.OS === 'web') {
        setConfirmationData({
          title: 'Login Required',
          message: 'You need to log in to join a game.',
          onCancel: () => setConfirmationVisible(false),
          onConfirm: () => {
            setConfirmationVisible(false);
            navigation.navigate('Login');
          },
          confirmText: 'Login'
        });
        setConfirmationVisible(true);
      } else {
        Alert.alert(
          'Login Required',
          'You need to log in to join a game.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => navigation.navigate('Login') }
          ]
        );
      }
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
                colors={[theme.colors.card.background, theme.colors.card.backgroundAlt]}
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
                      color: theme.colors.secondary,
                      size: 24 
                    }}
                    inputStyle={{
                      color: theme.colors.text.primary,
                      fontSize: theme.typography.sizes.xl,
                      fontWeight: theme.typography.weights.bold,
                      textAlign: 'left',
                      letterSpacing: 5,
                    }}
                    inputContainerStyle={{
                      borderBottomColor: theme.colors.secondary,
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
                    <Icon name="person" size={20} color={theme.colors.info} />
                    <Text style={styles.userInfoText}>
                      Joining as: <Text style={styles.userName}>{user.displayName || user.email}</Text>
                    </Text>
                  </View>
                ) : (
                  <View style={styles.userInfoContainer}>
                    <Icon name="warning" size={20} color={theme.colors.warning} />
                    <Text style={styles.userInfoText}>
                      You are not logged in
                    </Text>
                  </View>
                )}

                <View style={styles.buttonContainer}>
                  <CustomButton
                    title="JOIN GAME"
                    onPress={handleJoinGame}
                    loading={loading}
                    leftIcon={<Icon name="login" size={20} color={theme.colors.text.primary} />}
                    style={styles.joinButton}
                    fullWidth
                  />
                  
                  <CustomButton
                    title="BACK TO HOME"
                    onPress={() => navigation.navigate('Home')}
                    variant="outline"
                    leftIcon={<Icon name="home" size={20} color={theme.colors.primary} />}
                    style={styles.backButton}
                    fullWidth
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

      {/* Confirmation Modal for Web */}
      {confirmationVisible && confirmationData && (
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationTitle}>{confirmationData.title}</Text>
            <Text style={styles.confirmationText}>{confirmationData.message}</Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.cancelButton]} 
                onPress={confirmationData.onCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.confirmButton]} 
                onPress={confirmationData.onConfirm}
              >
                <Text style={styles.confirmButtonText}>{confirmationData.confirmText || 'Confirm'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.horizontalPadding,
    paddingBottom: theme.spacing.bottomNavHeight + theme.spacing.safeBottom + 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeSection: {
    marginBottom: theme.spacing.xl,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  formGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
  },
  codeInputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.info,
    marginBottom: theme.spacing.xs,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.lg,
  },
  userInfoText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  userName: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.bold,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
  },
  joinButton: {
    marginBottom: theme.spacing.md,
  },
  backButton: {
    marginTop: theme.spacing.xs,
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
  confirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmationContainer: {
    backgroundColor: theme.colors?.background?.secondary || '#343544',
    borderRadius: theme.borderRadius?.lg || 16,
    padding: theme.spacing?.lg || 24,
    width: '80%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmationTitle: {
    fontSize: theme.fontSizes?.lg || 16,
    fontWeight: 'bold',
    color: theme.colors?.text?.primary || '#FFFFFF',
    marginBottom: theme.spacing?.md || 16,
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: theme.fontSizes?.md || 14,
    color: theme.colors?.text?.secondary || '#CCCCCC',
    marginBottom: theme.spacing?.lg || 24,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmationButton: {
    paddingVertical: theme.spacing?.sm || 8,
    paddingHorizontal: theme.spacing?.md || 16,
    borderRadius: theme.borderRadius?.md || 8,
    flex: 1,
    marginHorizontal: theme.spacing?.xs || 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors?.background?.tertiary || '#2A2A3A',
  },
  cancelButtonText: {
    color: theme.colors?.text?.primary || '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: theme.colors?.primary || '#BB86FC',
  },
  confirmButtonText: {
    color: theme.colors?.text?.primary || '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default JoinGameScreen;
