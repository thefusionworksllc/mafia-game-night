// src/screens/home/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import BottomNavigation from '../components/BottomNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import ModernBackground from '../components/ModernBackground';
import { useError } from '../context/ErrorContext';
import { gameService } from '../services/gameService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const { showError } = useError();
  const [activeGame, setActiveGame] = useState(null);
  const [loadingGame, setLoadingGame] = useState(true);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  // Check if user is null and handle accordingly
  const isLoggedIn = !!user;

  // Check for success messages passed from other screens
  useEffect(() => {
    if (route.params?.showSuccess && route.params?.successMessage) {
      showError(route.params.successMessage, 'success');
      // Clean up params after showing message
      navigation.setParams({ showSuccess: undefined, successMessage: undefined });
    }
  }, [route.params?.showSuccess, route.params?.successMessage]);

  // Check for active games
  useEffect(() => {
    const checkActiveGames = async () => {
      if (!user) {
        setLoadingGame(false);
        return;
      }
      
      try {
        setLoadingGame(true);
        const game = await gameService.getUserActiveGame(user.uid);
        setActiveGame(game);
      } catch (error) {
        console.error('Error checking active games:', error);
      } finally {
        setLoadingGame(false);
      }
    };
    
    checkActiveGames();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      if (Platform.OS === 'web') {
        setConfirmationData({
          title: 'Error',
          message: 'Failed to sign out. Please try again.',
          onCancel: null,
          onConfirm: () => setConfirmationVisible(false),
          confirmText: 'OK'
        });
        setConfirmationVisible(true);
      } else {
        Alert.alert('Error', 'Failed to sign out. Please try again.');
      }
    }
  };

  // Function to navigate to the appropriate screen based on game status
  const handleContinueGame = async () => {
    if (!activeGame) return;
    
    try {
      setLoadingGame(true);
      const gameData = await gameService.getGameData(activeGame.gameCode);
      const isUserHost = await gameService.isGameHost(activeGame.gameCode);
      
      // Get game settings
      const settings = gameData?.settings || {};
      
      if (gameData.status === 'waiting') {
        // Game is in lobby
        navigation.navigate('GameLobby', {
          gameCode: activeGame.gameCode,
          isHost: isUserHost,
          totalPlayers: settings.totalPlayers || 0,
          mafiaCount: settings.mafiaCount || 0,
          detectiveCount: settings.detectiveCount || 0,
          doctorCount: settings.doctorCount || 0
        });
      } else if (gameData.status === 'started') {
        if (isUserHost) {
          // Host should go to GameControl
          navigation.navigate('GameControl', { 
            gameCode: activeGame.gameCode 
          });
        } else {
          // Player should go to GamePlay
          const currentPlayer = gameData.players[user.uid];
          const role = currentPlayer?.role || 'civilian';
          navigation.navigate('GamePlay', { 
            gameCode: activeGame.gameCode,
            role: role
          });
        }
      }
    } catch (error) {
      console.error('Error continuing game:', error);
      showError('Failed to continue game: ' + error.message);
    } finally {
      setLoadingGame(false);
    }
  };

  const tutorialSections = [
    {
      title: 'Game Overview',
      description: 'Learn the basics of Mafia game and how to play',
      icon: 'games',
      screen: 'GameOverview',
    },
    {
      title: 'Roles & Abilities',
      description: 'Discover different roles and their special abilities',
      icon: 'person',
      screen: 'RolesAndAbilities',
    },
    {
      title: 'Game Phases',
      description: 'Understanding day and night phases',
      icon: 'wb-sunny',
      screen: 'GamePhases',
    },
    {
      title: 'Winning Strategies',
      description: 'Tips and tricks to improve your gameplay',
      icon: 'emoji-events',
      screen: 'WinningStrategies',
    },
  ];

  const TutorialCard = ({ title, description, icon, screen }) => (
    <TouchableOpacity 
      style={styles.tutorialCard}
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={theme.gradients.card}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardIconContainer}>
          <Icon name={icon} size={28} color={theme.colors.primary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Icon name="chevron-right" size={20} color={theme.colors.text.secondary} />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground withAnimation={true}>
        <ScrollView 
          style={theme.commonStyles.scrollContainer}
          contentContainerStyle={theme.commonStyles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <LinearGradient
              colors={['rgba(138, 43, 226, 0.8)', 'rgba(75, 0, 130, 0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.titleGradientContainer}
            >
              <View style={styles.appTitleContainer}>
                <Icon name="security" size={48} color={theme.colors.warning} />
                <Text style={styles.appTitle}>MAFIA</Text>
              </View>
              <View style={styles.subtitleContainer}>
                <Text style={styles.appSubTitle}>THE GAME NIGHT</Text>
                <View style={styles.subtitleUnderline} />
              </View>
            </LinearGradient>
            {isLoggedIn ? (
              <View style={styles.userInfoContainer}>
                <Icon name="account-circle" size={20} color={theme.colors.primary} />
                <Text style={styles.loggedInText}>
                  Logged in as: <Text style={styles.username}>{user.displayName}</Text>
                </Text>
              </View>
            ) : (
              <CustomButton
                title="LOGIN / REGISTER"
                onPress={() => navigation.navigate('Login')}
                variant="outline"
                size="small"
                leftIcon={<Icon name="login" size={16} color={theme.colors.primary} />}
                style={styles.loginButton}
              />
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('HostGame')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={theme.gradients.accent}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="add-circle" size={24} color={theme.colors.text.primary} />
                  <Text style={styles.actionText}>HOST GAME</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('JoinGame')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={theme.gradients.accentSecondary}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="group-add" size={24} color={theme.colors.text.primary} />
                  <Text style={styles.actionText}>JOIN GAME</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Active Game Section - Improved and shown when there's an active game */}
          {isLoggedIn && activeGame && (
            <View style={styles.activeGameSection}>
              <LinearGradient
                colors={['rgba(158, 42, 155, 0.2)', 'rgba(108, 42, 205, 0.3)']}
                style={styles.activeGameGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.activeGameHeader}>
                  <Icon name="videogame-asset" size={28} color={theme.colors.warning} />
                  <Text style={styles.activeGameTitle}>Active Game</Text>
                </View>
                
                <View style={styles.activeGameDetails}>
                  <View style={styles.gameCodeContainer}>
                    <Text style={styles.gameCodeLabel}>Game Code:</Text>
                    <Text style={styles.gameCode}>{activeGame.gameCode}</Text>
                  </View>
                  
                  <View style={styles.gameStatusContainer}>
                    <Text style={styles.gameStatusLabel}>Status:</Text>
                    <Text style={[
                      styles.gameStatus,
                      activeGame.status === 'waiting' ? styles.statusWaiting : styles.statusStarted
                    ]}>
                      {activeGame.status === 'waiting' ? 'Lobby' : 'In Progress'}
                    </Text>
                  </View>
                </View>
                
                <CustomButton
                  title={`CONTINUE ${activeGame.status === 'waiting' ? 'TO LOBBY' : 'GAME'}`}
                  onPress={handleContinueGame}
                  loading={loadingGame}
                  leftIcon={<Icon name="play-arrow" size={20} color={theme.colors.text.primary} />}
                  style={styles.continueGameButton}
                />
              </LinearGradient>
            </View>
          )}

          {/* Tutorial Section */}
          <View style={styles.tutorialSection}>
            <Text style={styles.sectionTitle}>How to Play</Text>
            <Text style={styles.sectionSubtitle}>Learn the Mafia game mechanics</Text>
            <View style={styles.tutorialGrid}>
              {tutorialSections.map((section, index) => (
                <TutorialCard key={index} {...section} />
              ))}
            </View>
          </View>

          {/* Game History Section */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={() => navigation.navigate('GameHistory')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.historyGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="history" size={24} color={theme.colors.primary} />
                <Text style={styles.historyText}>VIEW GAME HISTORY</Text>
                <Icon name="chevron-right" size={20} color={theme.colors.text.secondary} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Profile Section - Only shown when logged in */}
          {isLoggedIn && (
            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Your Profile</Text>
              <TouchableOpacity 
                style={styles.historyButton}
                onPress={() => navigation.navigate('EditProfile')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={theme.gradients.card}
                  style={styles.historyGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="person" size={24} color={theme.colors.primary} />
                  <Text style={styles.historyText}>EDIT PROFILE</Text>
                  <Icon name="chevron-right" size={20} color={theme.colors.text.secondary} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="Home" />

      {/* Confirmation Modal for Web */}
      {confirmationVisible && confirmationData && (
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationTitle}>{confirmationData.title}</Text>
            <Text style={styles.confirmationText}>{confirmationData.message}</Text>
            <View style={styles.confirmationButtons}>
              {confirmationData.onCancel && (
                <TouchableOpacity 
                  style={[styles.confirmationButton, styles.cancelButton]} 
                  onPress={confirmationData.onCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[
                  styles.confirmationButton, 
                  confirmationData.onCancel ? styles.confirmButton : styles.singleButton
                ]} 
                onPress={confirmationData.onConfirm}
              >
                <Text style={styles.confirmButtonText}>{confirmationData.confirmText || 'OK'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  welcomeText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing.xs,
  },
  titleGradientContainer: {
    borderRadius: 15,
    padding: 15,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  appTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    marginLeft: theme.spacing.md,
    letterSpacing: 3,
    // Text shadow for 3D effect
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitleContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  appSubTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.text.secondary,
    letterSpacing: 4,
  },
  subtitleUnderline: {
    height: 2,
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 5,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    alignSelf: 'flex-start',
    ...theme.shadows.small,
  },
  loggedInText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  username: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  quickActionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  actionText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    marginLeft: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  tutorialSection: {
    marginBottom: theme.spacing.xl,
  },
  tutorialGrid: {
    marginTop: theme.spacing.sm,
  },
  tutorialCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  historySection: {
    marginBottom: theme.spacing.xl,
  },
  profileSection: {
    marginBottom: theme.spacing.xxl,
  },
  historyButton: {
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  historyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  historyText: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  // Active Game Section
  activeGameSection: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  activeGameGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
  },
  activeGameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  activeGameTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.warning,
    marginLeft: theme.spacing.sm,
  },
  activeGameDetails: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  gameCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  gameCodeLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
  gameCode: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  gameStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameStatusLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
  gameStatus: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  statusWaiting: {
    color: theme.colors.warning,
  },
  statusStarted: {
    color: theme.colors.success,
  },
  continueGameButton: {
    marginTop: theme.spacing.sm,
  },
  // Add styles for web confirmation modal
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
  singleButton: {
    backgroundColor: theme.colors?.primary || '#BB86FC',
    marginHorizontal: 0,
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

export default HomeScreen;