import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  StatusBar, 
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Animated,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/gameService';
import BottomNavigation from '../components/BottomNavigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import ModernBackground from '../components/ModernBackground';
import { useError } from '../context/ErrorContext';

const GameControlScreen = ({ route, navigation }) => {
  const { gameCode } = route.params;
  const [gameData, setGameData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('preparation'); // preparation, day, night, voting, results
  const [timer, setTimer] = useState(180); // 3 minutes timer
  const [timerActive, setTimerActive] = useState(false);
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);
  const { user } = useAuth();
  const { showError, showToast } = useError();
  
  // Animation values
  const phaseAnimation = useState(new Animated.Value(0))[0];
  const timerAnimation = useState(new Animated.Value(1))[0];
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    const unsubscribe = gameService.subscribeToGame(gameCode, (data) => {
      if (!data) {
        showError('Game not found or ended', 'warning');
        navigation.replace('Home');
        return;
      }

      setGameData(data);
      if (data.players) {
        const playersList = Object.values(data.players).filter(player => !player.isHost);
        setPlayers(playersList);
      }

      // Set game phase from data if available
      if (data.currentPhase) {
        setCurrentPhase(data.currentPhase);
        animatePhaseChange();
      }

      // Set eliminated players if available
      if (data.eliminatedPlayers) {
        setEliminatedPlayers(data.eliminatedPlayers);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameCode, navigation, showError]);

  // Verify that the current user is the host
  useEffect(() => {
    const checkHostStatus = async () => {
      try {
        const isHost = await gameService.isGameHost(gameCode);
        if (!isHost) {
          showError('Only the host can access the game control screen', 'warning');
          navigation.replace('PlayerRole', { 
            gameCode, 
            isHost: false,
            role: await gameService.getPlayerRole(gameCode)
          });
        }
      } catch (error) {
        showError(error.message || 'Failed to verify host status');
        navigation.replace('Home');
      }
    };

    checkHostStatus();
  }, [gameCode, navigation, showError]);

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      handlePhaseComplete();
    }

    return () => clearInterval(interval);
  }, [timerActive, timer]);

  // Animation for phase changes
  const animatePhaseChange = () => {
    phaseAnimation.setValue(0);
    Animated.timing(phaseAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  // Animation for timer warnings
  useEffect(() => {
    if (timer <= 30 && timerActive) {
      Animated.sequence([
        Animated.timing(timerAnimation, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(timerAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [timer, timerActive, timerAnimation]);

  const handleStartPhase = (phase) => {
    setLoading(true);
    setCurrentPhase(phase);
    animatePhaseChange();
    setTimer(getPhaseTime(phase));
    setTimerActive(true);

    // Update game phase in database
    gameService.updateGamePhase(gameCode, phase)
      .then(() => {
      })
      .catch(error => {
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePhaseComplete = () => {
    let nextPhase;
    switch (currentPhase) {
      case 'preparation':
        nextPhase = 'day';
        break;
      case 'day':
        nextPhase = 'voting';
        break;
      case 'voting':
        nextPhase = 'night';
        break;
      case 'night':
        nextPhase = 'results';
        break;
      case 'results':
        nextPhase = 'day';
        break;
      default:
        nextPhase = 'day';
    }
    
    handleStartPhase(nextPhase);
  };

  const getPhaseTime = (phase) => {
    switch (phase) {
      case 'preparation':
        return 60; // 1 minute
      case 'day':
        return 180; // 3 minutes
      case 'voting':
        return 60; // 1 minute
      case 'night':
        return 120; // 2 minutes
      case 'results':
        return 60; // 1 minute
      default:
        return 180; // 3 minutes
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'preparation':
        return theme.colors.info;
      case 'day':
        return theme.colors.warning;
      case 'voting':
        return theme.colors.primary;
      case 'night':
        return theme.colors.tertiary;
      case 'results':
        return theme.colors.success;
      default:
        return theme.colors.info;
    }
  };

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'preparation':
        return 'settings';
      case 'day':
        return 'wb-sunny';
      case 'voting':
        return 'how-to-vote';
      case 'night':
        return 'nights-stay';
      case 'results':
        return 'announcement';
      default:
        return 'error';
    }
  };

  const handleEndGame = () => {
    if (Platform.OS === 'web') {
      setConfirmationData({
        title: "End Game",
        message: "Are you sure you want to end the game? This action cannot be undone.",
        onCancel: () => setConfirmationVisible(false),
        onConfirm: async () => {
          setConfirmationVisible(false);
          try {
            setLoading(true);
            const result = await gameService.endGame(gameCode);
            console.log('End game result:', result);
            
            // Add slight delay before navigation to ensure UI updates
            setTimeout(() => {
              navigation.replace('Home');
            }, 500);
          } catch (error) {
            console.error('Error ending game:', error);
          } finally {
            setLoading(false);
          }
        }
      });
      setConfirmationVisible(true);
    } else {
      Alert.alert(
        "End Game",
        "Are you sure you want to end the game? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "End Game", 
            style: "destructive",
            onPress: async () => {
              try {
                setLoading(true);
                const result = await gameService.endGame(gameCode);
                console.log('End game result:', result);
                
                // Add slight delay before navigation to ensure UI updates
                setTimeout(() => {
                  navigation.replace('Home');
                }, 500);
              } catch (error) {
                console.error('Error ending game:', error);
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    }
  };

  const handleReturnToLobby = async () => {
    try {
      const isHost = await gameService.isGameHost(gameCode);
      
      navigation.replace('GameLobby', {
        gameCode,
        isHost,
        totalPlayers: gameData?.settings?.totalPlayers || 5,
        mafiaCount: gameData?.settings?.mafiaCount || 1,
        detectiveCount: gameData?.settings?.detectiveCount || 1,
        doctorCount: gameData?.settings?.doctorCount || 1
      });
    } catch (error) {
      showError(error.message || 'Failed to return to lobby');
    }
  };

  const handleViewPlayerRole = () => {
    navigation.replace('PlayerRole', {
      gameCode,
      isHost: true
    });
  };

  // Add this function to get role color
  const getRoleColor = (role) => {
    const normalizedRole = role?.toLowerCase();
    switch(normalizedRole) {
      case 'mafia':
        return theme.colors.mafia;
      case 'detective':
        return theme.colors.detective;
      case 'doctor':
        return theme.colors.doctor;
      case 'civilian':
        return theme.colors.civilian;
      default:
        return theme.colors.text.secondary;
    }
  };

  // Add this function to sort players by role
  const getSortedPlayers = () => {
    const roleOrder = {
      'mafia': 1,
      'doctor': 2,
      'detective': 3,
      'civilian': 4
    };

    return [...players].sort((a, b) => {
      const roleA = a.role?.toLowerCase() || 'civilian';
      const roleB = b.role?.toLowerCase() || 'civilian';
      return (roleOrder[roleA] || 5) - (roleOrder[roleB] || 5);
    });
  };

  if (loading) {
    return (
      <View style={[theme.commonStyles.container, styles.centerContainer]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ModernBackground>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading game control...</Text>
        </ModernBackground>
      </View>
    );
  }

  const phaseTransform = {
    opacity: phaseAnimation,
    transform: [
      {
        translateY: phaseAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  const timerTransform = {
    transform: [
      { scale: timerAnimation }
    ]
  };

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <ScrollView
          style={theme.commonStyles.scrollContainer}
          contentContainerStyle={theme.commonStyles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={theme.commonStyles.title}>Game Control</Text>
          
          {/* Game Code Display */}
          <View style={styles.gameCodeContainer}>
            <Text style={styles.gameCodeLabel}>Game Code:</Text>
            <Text style={styles.gameCode}>{gameCode}</Text>
          </View>

          {/* Current Phase Display */}
          <Animated.View style={[styles.phaseContainer, phaseTransform]}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.phaseGradient}
            >
              <View style={[styles.phaseIconContainer, { backgroundColor: `${getPhaseColor(currentPhase)}40` }]}>
                <Icon name={getPhaseIcon(currentPhase)} size={32} color={getPhaseColor(currentPhase)} />
              </View>
              <Text style={styles.phaseTitle}>
                {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase
              </Text>
              
              {timerActive && (
                <Animated.View style={[styles.timerContainer, timerTransform]}>
                  <Text style={[
                    styles.timerText, 
                    timer <= 30 ? styles.timerWarning : null
                  ]}>
                    {formatTimer(timer)}
                  </Text>
                </Animated.View>
              )}
              
              <View style={styles.phaseActions}>
                {!timerActive ? (
                  <CustomButton
                    title={`START ${currentPhase.toUpperCase()} PHASE`}
                    onPress={() => handleStartPhase(currentPhase)}
                    leftIcon={<Icon name="play-arrow" size={20} color="#fff" />}
                    fullWidth
                  />
                ) : (
                  <View style={styles.timerControls}>
                    <CustomButton
                      title="PAUSE"
                      onPress={() => setTimerActive(false)}
                      leftIcon={<Icon name="pause" size={20} color="#fff" />}
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <CustomButton
                      title="SKIP"
                      onPress={handlePhaseComplete}
                      leftIcon={<Icon name="skip-next" size={20} color="#fff" />}
                      style={{ flex: 1, marginLeft: 8 }}
                    />
                  </View>
                )}
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Game Controls */}
          <View style={styles.controlSection}>
            <Text style={styles.sectionTitle}>Game Controls</Text>
            
            <View style={styles.gameControlsContainer}>
              <TouchableOpacity 
                style={styles.phaseButton}
                onPress={() => handleStartPhase('preparation')}
              >
                <LinearGradient
                  colors={[`${theme.colors.info}40`, `${theme.colors.info}20`]}
                  style={styles.phaseButtonGradient}
                >
                  <Icon name="settings" size={24} color={theme.colors.info} />
                  <Text style={styles.phaseButtonText}>Preparation</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.phaseButton}
                onPress={() => handleStartPhase('day')}
              >
                <LinearGradient
                  colors={[`${theme.colors.warning}40`, `${theme.colors.warning}20`]}
                  style={styles.phaseButtonGradient}
                >
                  <Icon name="wb-sunny" size={24} color={theme.colors.warning} />
                  <Text style={styles.phaseButtonText}>Day</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.phaseButton}
                onPress={() => handleStartPhase('voting')}
              >
                <LinearGradient
                  colors={[`${theme.colors.primary}40`, `${theme.colors.primary}20`]}
                  style={styles.phaseButtonGradient}
                >
                  <Icon name="how-to-vote" size={24} color={theme.colors.primary} />
                  <Text style={styles.phaseButtonText}>Voting</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.phaseButton}
                onPress={() => handleStartPhase('night')}
              >
                <LinearGradient
                  colors={[`${theme.colors.tertiary}40`, `${theme.colors.tertiary}20`]}
                  style={styles.phaseButtonGradient}
                >
                  <Icon name="nights-stay" size={24} color={theme.colors.tertiary} />
                  <Text style={styles.phaseButtonText}>Night</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.phaseButton}
                onPress={() => handleStartPhase('results')}
              >
                <LinearGradient
                  colors={[`${theme.colors.success}40`, `${theme.colors.success}20`]}
                  style={styles.phaseButtonGradient}
                >
                  <Icon name="announcement" size={24} color={theme.colors.success} />
                  <Text style={styles.phaseButtonText}>Results</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Players List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Players</Text>
            <View style={styles.playersListContainer}>
              {getSortedPlayers().map(player => (
                <LinearGradient
                  key={player.id}
                  colors={[`${getRoleColor(player.role)}10`, `${getRoleColor(player.role)}30`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.playerItem,
                    eliminatedPlayers.includes(player.id) && styles.eliminatedPlayer
                  ]}
                >
                  <View style={styles.playerInfo}>
                    <View style={[styles.playerIconContainer, { backgroundColor: `${getRoleColor(player.role)}40` }]}>
                      <Icon 
                        name={player.role?.toLowerCase() === 'mafia' ? 'security' : 
                             player.role?.toLowerCase() === 'detective' ? 'visibility' :
                             player.role?.toLowerCase() === 'doctor' ? 'healing' : 'person'} 
                        size={20} 
                        color={getRoleColor(player.role)} 
                      />
                    </View>
                    <View style={styles.playerTextContainer}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <View style={[styles.roleBadge, { backgroundColor: `${getRoleColor(player.role)}40` }]}>
                        <Text style={[styles.playerRole, { color: getRoleColor(player.role) }]}>
                          {player.role?.charAt(0).toUpperCase() + player.role?.slice(1) || 'Civilian'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Status indication */}
                  <View style={[
                    styles.playerStatus,
                    eliminatedPlayers.includes(player.id) 
                      ? styles.playerEliminated 
                      : styles.playerActive
                  ]}>
                    <Text style={styles.playerStatusText}>
                      {eliminatedPlayers.includes(player.id) ? 'Eliminated' : 'Active'}
                    </Text>
                  </View>
                </LinearGradient>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>           
            <CustomButton
              title="END GAME"
              onPress={handleEndGame}
              leftIcon={<Icon name="cancel" size={20} color={theme.colors.error} />}
              variant="outline"
              fullWidth
              style={styles.endGameButton}
            />
          </View>

          {/* Game Navigation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Navigation</Text>
            <View style={styles.buttonGroup}>
              <CustomButton
                title="VIEW ALL ROLES"
                onPress={handleViewPlayerRole}
                leftIcon={<Icon name="person" size={20} color={theme.colors.text.primary} />}
                style={styles.navigationButton}
              />
              <CustomButton
                title="RETURN TO LOBBY"
                onPress={handleReturnToLobby}
                leftIcon={<Icon name="meeting-room" size={20} color={theme.colors.text.primary} />}
                style={styles.navigationButton}
              />
            </View>
          </View>
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
                <Text style={styles.confirmButtonText}>End Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.primary,
  },
  gameCodeContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  gameCodeLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  gameCode: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
  },
  phaseContainer: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  phaseGradient: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  phaseIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  phaseTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  timerContainer: {
    marginBottom: theme.spacing.md,
  },
  timerText: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  timerWarning: {
    color: theme.colors.warning,
  },
  phaseActions: {
    width: '100%',
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
  },
  gameControlsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  phaseButton: {
    width: '48%',
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  phaseButtonGradient: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  phaseButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navigationButton: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  playersListContainer: {
    marginTop: theme.spacing.sm,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...theme.shadows.small,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  playerTextContainer: {
    flex: 1,
  },
  playerName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.small,
  },
  playerRole: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
  },
  playerStatus: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.small,
  },
  playerActive: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
  },
  playerEliminated: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  playerStatusText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
  },
  eliminatedPlayer: {
    opacity: 0.7,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  actionButtons: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  returnButton: {
    marginBottom: theme.spacing.md,
  },
  endGameButton: {
    borderColor: theme.colors.error,
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
    backgroundColor: theme.colors?.error || '#CF6679',
  },
  confirmButtonText: {
    color: theme.colors?.text?.primary || '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default GameControlScreen; 