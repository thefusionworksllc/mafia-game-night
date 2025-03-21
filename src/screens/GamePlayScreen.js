import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  StatusBar, 
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Image
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

// Role images for players
const roleImages = {
  civilian: require('../../assets/civilian.png'),
  mafia: require('../../assets/mafia.png'),
  detective: require('../../assets/detective.png'),
  doctor: require('../../assets/doctor.png'),
};

const GamePlayScreen = ({ route, navigation }) => {
  const { gameCode, role = 'civilian' } = route.params;
  const [gameData, setGameData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [phaseTimer, setPhaseTimer] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [mafiaVotes, setMafiaVotes] = useState({});
  const [civilianVotes, setCivilianVotes] = useState({});
  const [investigationResults, setInvestigationResults] = useState({});
  const [protectedPlayer, setProtectedPlayer] = useState(null);
  const [eliminated, setEliminated] = useState(false);
  const { user } = useAuth();
  const { showError } = useError();
  
  // Animation values
  const phaseAnimation = useState(new Animated.Value(0))[0];
  const pulseAnimation = useState(new Animated.Value(1))[0];

  // Add isHost state
  const [isHost, setIsHost] = useState(false);

  // Convert role to lowercase for matching
  const normalizedRole = role ? role.toLowerCase() : 'civilian';

  useEffect(() => {
    const unsubscribe = gameService.subscribeToGame(gameCode, (data) => {
      if (!data) {
        showError('Game not found or has ended');
        navigation.replace('Home');
        return;
      }

      setGameData(data);

      // Check if user is host
      setIsHost(data.hostId === user.uid);

      // Extract players list (excluding host)
      const playersList = Object.values(data.players).filter(player => !player.isHost);
      setPlayers(playersList);

      // Get current phase
      if (data.currentPhase) {
        setCurrentPhase(data.currentPhase);
        
        // Handle phase timer if available
        if (data.currentPhaseEndTime) {
          const endTime = new Date(data.currentPhaseEndTime).getTime();
          const now = new Date().getTime();
          const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
          setPhaseTimer(remaining);
        }
      }

      // Check if player is eliminated
      const currentPlayer = data.players[user.uid];
      if (currentPlayer && currentPlayer.eliminated) {
        setEliminated(true);
      }

      // Get voting data if available
      if (data.votes) {
        // Handle mafia votes
        if (data.votes.mafia) {
          setMafiaVotes(data.votes.mafia);
        }
        
        // Handle civilian votes
        if (data.votes.civilian) {
          setCivilianVotes(data.votes.civilian);
        }
      }
      
      // Get investigation results if available (for detective)
      if (data.investigationResults && data.investigationResults[user.uid]) {
        setInvestigationResults(data.investigationResults[user.uid]);
      }
      
      // Get protected player info if available (for doctor)
      if (data.protectedPlayers && role.toLowerCase() === 'doctor') {
        setProtectedPlayer(data.protectedPlayers[user.uid]);
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [gameCode, user.uid, role, navigation, showError]);

  // Start pulse animation for player actions
  useEffect(() => {
    const startPulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (['voting', 'night'].includes(currentPhase)) {
          startPulseAnimation();
        }
      });
    };

    if (['voting', 'night'].includes(currentPhase)) {
      startPulseAnimation();
    } else {
      pulseAnimation.setValue(1);
    }

    return () => {
      pulseAnimation.stopAnimation();
    };
  }, [currentPhase, pulseAnimation]);

  // Animation for phase changes
  const animatePhaseChange = () => {
    phaseAnimation.setValue(0);
    Animated.timing(phaseAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const canPerformAction = () => {
    if (eliminated) return false;

    switch (normalizedRole) {
      case 'mafia':
        return currentPhase === 'night';
      case 'detective':
        return currentPhase === 'night';
      case 'doctor':
        return currentPhase === 'night';
      case 'civilian':
        return currentPhase === 'voting';
      default:
        return false;
    }
  };

  const handlePlayerSelect = (player) => {
    if (!canPerformAction() || player.id === user.uid) return;
    
    setSelectedPlayer(player);
    
    // Show confirmation before performing action
    if (['voting', 'night'].includes(currentPhase)) {
      const action = getActionText();
      
      Alert.alert(
        `Confirm ${action}`,
        `Are you sure you want to ${action.toLowerCase()} ${player.name}?`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setSelectedPlayer(null) },
          { text: 'Confirm', onPress: () => performAction(player) }
        ]
      );
    }
  };

  const performAction = async (player) => {
    try {
      switch (normalizedRole) {
        case 'mafia':
          await gameService.submitMafiaVote(gameCode, player.id);
          showError(`You have chosen to eliminate ${player.name}`, 'success');
          break;
        case 'detective':
          const isMafia = await gameService.investigatePlayer(gameCode, player.id);
          showError(
            `Investigation Result: ${player.name} is ${isMafia ? 'a member of the Mafia!' : 'not a member of the Mafia.'}`,
            isMafia ? 'warning' : 'info'
          );
          // Store the result locally
          setInvestigationResults(prev => ({
            ...prev,
            [player.id]: { isMafia, investigatedAt: new Date().toISOString() }
          }));
          break;
        case 'doctor':
          await gameService.protectPlayer(gameCode, player.id);
          showError(`You have chosen to protect ${player.name} tonight`, 'success');
          setProtectedPlayer(player.id);
          break;
        case 'civilian':
          await gameService.submitCivilianVote(gameCode, player.id);
          showError(`You have voted to eliminate ${player.name}`, 'success');
          break;
      }
    } catch (error) {
      showError(error.message || 'Failed to perform action');
    } finally {
      setSelectedPlayer(null);
    }
  };

  const getActionText = () => {
    switch (normalizedRole) {
      case 'mafia':
        return 'Eliminate';
      case 'detective':
        return 'Investigate';
      case 'doctor':
        return 'Protect';
      case 'civilian':
      default:
        return 'Vote';
    }
  };

  const getPhaseDescription = () => {
    if (eliminated) {
      return "You have been eliminated. Watch the game unfold.";
    }
    
    switch (currentPhase) {
      case 'preparation':
        return "The host is preparing the game. Please wait.";
      case 'day':
        return "Discuss with other players and try to identify the Mafia.";
      case 'voting':
        return "Vote for a player you suspect of being in the Mafia.";
      case 'night':
        switch (normalizedRole) {
          case 'mafia':
            return "Choose a player to eliminate during the night.";
          case 'detective':
            return "Choose a player to investigate whether they are Mafia.";
          case 'doctor':
            return "Choose a player to protect from the Mafia's elimination.";
          default:
            return "It's night time. Sleep tight and hope you survive.";
        }
      case 'results':
        return "See the results of last night's actions.";
      default:
        return "Waiting for the host to start the game...";
    }
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

  const getRoleColor = (playerRole) => {
    const normalizedPlayerRole = playerRole?.toLowerCase();
    switch(normalizedPlayerRole) {
      case 'mafia':
        return theme.colors.tertiary;
      case 'detective':
        return theme.colors.info;
      case 'doctor':
        return theme.colors.success;
      case 'civilian':
        return theme.colors.primary;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getRoleIcon = (playerRole) => {
    const normalizedPlayerRole = playerRole?.toLowerCase();
    switch(normalizedPlayerRole) {
      case 'mafia':
        return 'security';
      case 'detective':
        return 'search';
      case 'doctor':
        return 'healing';
      case 'civilian':
        return 'people';
      default:
        return 'person';
    }
  };

  const handleReturnToLobby = async () => {
    try {
      // Check if user is the host
      const isUserHost = await gameService.isGameHost(gameCode);
      
      // Fetch game settings
      const gameData = await gameService.getGameData(gameCode);
      const settings = gameData?.settings || {};
      
      navigation.replace('GameLobby', {
        gameCode,
        isHost: isUserHost,
        totalPlayers: settings.totalPlayers || 0,
        mafiaCount: settings.mafiaCount || 0, 
        detectiveCount: settings.detectiveCount || 0,
        doctorCount: settings.doctorCount || 0
      });
    } catch (error) {
      showError('Failed to return to lobby: ' + (error.message || 'Unknown error'));
    }
  };

  // Add the handleEndGame function
  const handleEndGame = async () => {
    try {
      setLoading(true);
      await gameService.endGame(gameCode);
      showError('Game ended successfully', 'success');
      navigation.replace('Home');
    } catch (error) {
      console.error('Error ending game:', error);
      showError(error.message || 'Failed to end game');
    } finally {
      setLoading(false);
    }
  };

  // Add a confirmEndGame function that shows an alert before ending the game
  const confirmEndGame = () => {
    Alert.alert(
      "End Game",
      "Are you sure you want to end this game? All players will be disconnected.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "End Game", onPress: handleEndGame, style: "destructive" }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[theme.commonStyles.container, styles.centerContainer]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ModernBackground>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading game...</Text>
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

  const actionTransform = {
    transform: [{ scale: pulseAnimation }]
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
          <Text style={theme.commonStyles.title}>
            {eliminated ? 'Game Over' : 'Game Play'}
          </Text>
          
          {/* Player Role Display */}
          <View style={styles.roleContainer}>
            <View style={[styles.roleInfoCard, { borderColor: getRoleColor(normalizedRole) }]}>
              <LinearGradient
                colors={[`${getRoleColor(normalizedRole)}40`, `${getRoleColor(normalizedRole)}10`]}
                style={styles.roleGradient}
              >
                <View style={styles.roleImageContainer}>
                  <Image 
                    source={roleImages[normalizedRole]} 
                    style={styles.roleImage} 
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.roleName}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
                {eliminated && (
                  <View style={styles.eliminatedBadge}>
                    <Text style={styles.eliminatedText}>ELIMINATED</Text>
                  </View>
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Game Code Display */}
          <View style={styles.gameCodeContainer}>
            <Text style={styles.gameCodeLabel}>Game Code:</Text>
            <Text style={styles.gameCode}>{gameCode}</Text>
          </View>

          {/* Current Phase Display */}
          {currentPhase && (
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
                <Text style={styles.phaseDescription}>
                  {getPhaseDescription()}
                </Text>
                
                {/* Action prompt for night or voting phases */}
                {canPerformAction() && (
                  <Animated.View style={[styles.actionPrompt, actionTransform]}>
                    <Text style={styles.actionPromptText}>
                      {`Select a player to ${getActionText().toLowerCase()}`}
                    </Text>
                  </Animated.View>
                )}
              </LinearGradient>
            </Animated.View>
          )}

          {/* Players List */}
          <View style={styles.playersSection}>
            <Text style={styles.sectionTitle}>Players</Text>
            <View style={styles.playersListContainer}>
              {players.map(player => {
                const isCurrentPlayer = player.id === user.uid;
                const isProtected = protectedPlayer === player.id;
                const isInvestigated = investigationResults[player.id];
                const isMafia = normalizedRole === 'mafia' && player.role === 'Mafia';
                
                return (
                  <TouchableOpacity 
                    key={player.id} 
                    style={[
                      styles.playerItem,
                      isCurrentPlayer && styles.currentPlayerItem,
                      player.eliminated && styles.eliminatedPlayer,
                      selectedPlayer?.id === player.id && styles.selectedPlayer
                    ]}
                    onPress={() => handlePlayerSelect(player)}
                    disabled={!canPerformAction() || isCurrentPlayer || player.eliminated}
                  >
                    <View style={styles.playerInfo}>
                      <Text style={[
                        styles.playerName,
                        isCurrentPlayer && styles.currentPlayerName
                      ]}>
                        {player.name} {isCurrentPlayer ? '(You)' : ''}
                      </Text>
                      
                      {/* Show role info if applicable */}
                      {(isCurrentPlayer || isMafia || 
                        (normalizedRole === 'detective' && isInvestigated)) && (
                        <View style={styles.playerRoleInfo}>
                          <Icon 
                            name={getRoleIcon(isInvestigated ? (isInvestigated.isMafia ? 'Mafia' : 'Not Mafia') : player.role)} 
                            size={16} 
                            color={getRoleColor(isInvestigated ? (isInvestigated.isMafia ? 'Mafia' : 'Not Mafia') : player.role)} 
                          />
                          <Text style={[
                            styles.playerRoleText,
                            { color: getRoleColor(isInvestigated ? (isInvestigated.isMafia ? 'Mafia' : 'Not Mafia') : player.role) }
                          ]}>
                            {isInvestigated 
                              ? (isInvestigated.isMafia ? 'Mafia' : 'Not Mafia') 
                              : player.role}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Status icons */}
                    <View style={styles.playerStatus}>
                      {player.eliminated && (
                        <Icon name="cancel" size={20} color={theme.colors.error} />
                      )}
                      {isProtected && normalizedRole === 'doctor' && (
                        <Icon name="shield" size={20} color={theme.colors.success} />
                      )}
                      {canPerformAction() && !isCurrentPlayer && !player.eliminated && (
                        <Icon 
                          name={getActionIcon()} 
                          size={20} 
                          color={getPhaseColor(currentPhase)} 
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <CustomButton
              title="RETURN TO LOBBY"
              onPress={handleReturnToLobby}
              leftIcon={<Icon name="arrow-back" size={20} color={theme.colors.text.accent} />}
              variant="outline"
              fullWidth
              style={styles.returnButton}
            />
            <CustomButton
              title="VIEW GAME HISTORY"
              onPress={() => navigation.navigate('GameHistory')}
              leftIcon={<Icon name="history" size={20} color={theme.colors.text.accent} />}
              variant="outline"
              fullWidth
              style={styles.historyButton}
            />
          </View>

          {/* End Game Button */}
          {isHost && (
            <CustomButton
              title="END GAME"
              onPress={confirmEndGame}
              variant="outline"
              style={styles.endGameButton}
              leftIcon={<Icon name="stop" size={20} color={theme.colors.error} />}
              fullWidth
            />
          )}
        </ScrollView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="Home" />
    </View>
  );
};

// Helper function to get the action icon based on role
const getActionIcon = () => {
  const { normalizedRole, currentPhase } = this;
  
  if (currentPhase === 'voting') return 'how-to-vote';
  
  switch (normalizedRole) {
    case 'mafia':
      return 'target';
    case 'detective':
      return 'search';
    case 'doctor':
      return 'healing';
    default:
      return 'touch-app';
  }
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
  roleContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  roleInfoCard: {
    width: '80%',
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    borderWidth: 2,
    ...theme.shadows.medium,
  },
  roleGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  roleImageContainer: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.md,
  },
  roleImage: {
    width: '100%',
    height: '100%',
  },
  roleName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  eliminatedBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
    marginTop: theme.spacing.sm,
  },
  eliminatedText: {
    color: theme.colors.error,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.sm,
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
    marginBottom: theme.spacing.sm,
  },
  phaseDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  actionPrompt: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.md,
  },
  actionPromptText: {
    color: theme.colors.text.accent,
    fontWeight: theme.typography.weights.bold,
  },
  playersSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
  },
  playersListContainer: {
    marginBottom: theme.spacing.md,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
  },
  currentPlayerItem: {
    backgroundColor: 'rgba(187, 134, 252, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  eliminatedPlayer: {
    opacity: 0.6,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  selectedPlayer: {
    backgroundColor: 'rgba(0, 255, 0, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  currentPlayerName: {
    color: theme.colors.primary,
  },
  playerRoleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  playerRoleText: {
    fontSize: theme.typography.sizes.sm,
    marginLeft: theme.spacing.xs,
  },
  playerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtons: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  returnButton: {
    marginBottom: theme.spacing.md,
  },
  historyButton: {
    marginBottom: theme.spacing.md,
  },
  endGameButton: {
    marginTop: theme.spacing.md,
    borderColor: theme.colors.error,
    marginBottom: theme.spacing.lg,
  },
});

export default GamePlayScreen; 