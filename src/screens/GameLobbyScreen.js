import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Alert, 
  FlatList,
  StatusBar,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme'; 
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/gameService';
import BottomNavigation from '../components/BottomNavigation';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModernBackground from '../components/ModernBackground';
import { useError } from '../context/ErrorContext';

const GameLobbyScreen = ({ route, navigation }) => {
  const { gameCode, totalPlayers, mafiaCount, detectiveCount, doctorCount, isHost } = route.params;
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { showError } = useError();
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState(null);

  // Get actual players (excluding host)
  const actualPlayers = useMemo(() => {
    return players.filter(player => !player.isHost);
  }, [players]);

  // Get the required number of players for this game (excluding host)
  const requiredPlayers = useMemo(() => {
    // totalPlayers should already exclude the host
    return totalPlayers;
  }, [totalPlayers]);

  // Get the civilian count
  const civilianCount = useMemo(() => {
    return requiredPlayers - mafiaCount - detectiveCount - doctorCount;
  }, [requiredPlayers, mafiaCount, detectiveCount, doctorCount]);

  // Get the host player
  const hostPlayer = useMemo(() => {
    return players.find(player => player.isHost);
  }, [players]);

  // Add back button handler to navigate to Game History
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('GameHistory');
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  // Check if user is null and handle accordingly
  if (!user) {
    showError('You need to log in to access the game lobby', 'warning');
    navigation.replace('Login'); // Redirect to LoginScreen
    return null; // Prevent rendering the rest of the component
  }

  useEffect(() => {
    const unsubscribe = gameService.subscribeToGame(gameCode, (data) => {
      if (!data) {
        showError('Game Ended', 'warning');
        navigation.replace('Home');
        return;
      }

      setGameData(data);
      setPlayers(Object.values(data.players || {}));

      // Handle game ended status
      if (data.status === 'ended') {
        const message = data.endReason === 'timeout' 
          ? 'Game has ended due to timeout (2 hours limit)'
          : 'Game has been ended by the host';
        showError(message, 'info');
        navigation.replace('Home');
        return;
      }

      // Check if game has started - only auto-navigate on initial game start
      // Don't auto-navigate if the host is already in the middle of a game and just visiting the lobby
      if (data.status === 'started' && !data.gameStartedAt) {
        // This is a fresh game start
        if (isHost) {
          navigation.replace('PlayerRole', {
            isHost: true,
            gameCode: gameCode
          });
        } else {
          const currentPlayer = data.players[user.uid];
          if (currentPlayer && currentPlayer.role) {
            navigation.replace('PlayerRole', {
              role: currentPlayer.role,
              isHost: false,
              gameCode: gameCode
            });
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [gameCode, navigation, user.uid, isHost, showError]);

  const handleStartGame = async () => {
    // Check if we have at least 4 players total (3 players + host) for minimum game requirements
    if (players.length < 4) {
      showError('At least 4 participants (including host) are required to start the game', 'warning');
      return;
    }

    // Check if we have enough non-host players based on game settings
    if (actualPlayers.length < requiredPlayers) {
      showError(`Waiting for ${requiredPlayers - actualPlayers.length} more player(s)...`, 'warning');
      return;
    }

    setLoading(true);
    try {
      await gameService.startGame(gameCode);
      showError('Game started!', 'success');
      navigation.navigate('RoleAssignment', { gameCode, isHost });
    } catch (error) {
      showError(error.message || 'Failed to start the game');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGame = async () => {
    try {
      await gameService.leaveGame(gameCode);
      showError('You have left the game', 'info');
      navigation.navigate('Home');
    } catch (error) {
      showError(error.message || 'Failed to leave the game');
    }
  };

  const handleRemovePlayer = (player) => {
    setPlayerToRemove(player);
    setConfirmationVisible(true);
  };

  const confirmRemovePlayer = async () => {
    if (!playerToRemove) return;
    
    try {
      setLoading(true);
      await gameService.removePlayerFromGame(gameCode, playerToRemove.id);
      // Remove player from local state
      setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== playerToRemove.id));
      setConfirmationVisible(false);
      setPlayerToRemove(null);
    } catch (error) {
      console.error('Error removing player:', error);
      showError('Failed to remove player: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelRemovePlayer = () => {
    setConfirmationVisible(false);
    setPlayerToRemove(null);
  };

  // Replace Alert.alert with this function that uses our state management
  const handleRemovePlayerConfirmation = (player) => {
    if (Platform.OS === 'web') {
      // Direct confirmation for web since Alert.alert doesn't work well
      handleRemovePlayer(player);
    } else {
      // Use Alert for native platforms
      Alert.alert(
        'Remove Player',
        `Are you sure you want to remove ${player.name} from the game?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => handleRemovePlayer(player),
          },
        ]
      );
    }
  };

  const handleEndGameConfirmation = () => {
    Alert.alert(
      "End Game",
      "Are you sure you want to end the game? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "End Game", onPress: handleEndGame, style: "destructive" }
      ]
    );
  };

  const handleEndGame = async () => {
    setLoading(true);
    try {
      console.log('Attempting to end game with code:', gameCode);
      const result = await gameService.endGame(gameCode);
      console.log('End game result:', result);
      showError('Game ended successfully', 'success');
      
      // Add slight delay before navigation to ensure UI updates
      setTimeout(() => {
        navigation.replace('Home');
      }, 500);
    } catch (error) {
      console.error('Error ending game:', error);
      showError(`Failed to end game: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyGameCode = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(gameCode);
      showError('Game code copied to clipboard!', 'success');
    } else {
      showError('Unable to copy game code to clipboard', 'warning');
    }
  };

  // Update the isGameInProgress function to be more reliable
  const isGameInProgress = () => {
    return gameData && gameData.status === 'started';
  };

  // Update the function to navigate to the GameControl screen
  const handleGoToGameControl = () => {
    if (isGameInProgress()) {
      navigation.navigate('GameControl', { gameCode });
    } else {
      showError('The game is not currently in progress', 'warning');
    }
  };

  const renderPlayer = ({ item }) => (
    <LinearGradient
      colors={['rgba(15, 23, 42, 0.7)', 'rgba(15, 23, 42, 0.6)']}
      style={styles.playerItem}
    >
      <View style={styles.playerContent}>
        <View style={styles.playerAvatarContainer}>
          <Icon name="person" size={24} color={theme.colors.secondary} style={styles.playerAvatar} />
        </View>
        <Text style={styles.playerName}>
          {item.name} 
          {item.id === user.uid && <Text style={styles.youLabel}> (You)</Text>}
        </Text>
      </View>
      
      {isHost && !item.isHost && (
        <TouchableOpacity 
          style={styles.removePlayerButton}
          onPress={() => handleRemovePlayerConfirmation(item)}
        >
          <Icon name="person-remove" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      )}
    </LinearGradient>
  );

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <View style={[theme.commonStyles.scrollContainer, {flex: 1, paddingBottom: 70}]}>
          <View style={styles.header}>
            <Text style={styles.title}>Game Lobby</Text>
            <TouchableOpacity 
              style={styles.gameCodeContainer}
              onPress={handleCopyGameCode}
              activeOpacity={0.7}
            >
              <Text style={styles.gameCodeLabel}>Game Code:</Text>
              <Text style={styles.gameCode}>
                {gameCode.length > 0 ? (
                  gameCode.match(/.{1,3}/g).join(' ')
                ) : (
                  gameCode
                )}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Host Information */}
          {hostPlayer && (
            <View style={styles.hostInfoContainer}>
              <Icon name="stars" size={30} color={theme.colors.secondary} />
              <Text style={styles.hostInfoText}>
                Host: <Text style={styles.hostName}>{hostPlayer.name}</Text>
              </Text>
            </View>
          )}

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="security" size={24} color={theme.colors.mafia} />
              <Text style={styles.infoText}>
                Mafia: {mafiaCount}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="visibility" size={24} color={theme.colors.detective} />
              <Text style={styles.infoText}>
                Detective: {detectiveCount}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="healing" size={24} color={theme.colors.doctor} />
              <Text style={styles.infoText}>
                Doctor: {doctorCount}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="person" size={24} color={theme.colors.civilian} />
              <Text style={styles.infoText}>
                Civilian: {civilianCount}
              </Text>
            </View>
          </View>

          <View style={styles.playersSection}>
           {/* <Text style={styles.sectionTitle}>Players</Text> */}
            <View style={styles.playersList}>
              <FlatList
                data={actualPlayers}
                keyExtractor={(item) => item.id}
                renderItem={renderPlayer}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.playersListContent}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No players have joined yet</Text>
                }
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {isHost ? (
              <>
                <View style={styles.playerCountContainer}>
                  <Text style={styles.playerCountText}>
                    Players: {actualPlayers.length}/{requiredPlayers}
                  </Text>
                  <Text style={styles.waitingText}>
                    {actualPlayers.length < requiredPlayers
                      ? `Waiting for ${requiredPlayers - actualPlayers.length} more player(s)...` 
                      : 'All players have joined! You can start the game.'}
                  </Text>
                </View>
                
                {isGameInProgress() ? (
                  <CustomButton
                    title="RETURN TO GAME CONTROL"
                    onPress={handleGoToGameControl}
                    leftIcon={<Icon name="sports-esports" size={20} color={theme.colors.text.primary} />}
                    loading={loading}
                    style={styles.actionButton}
                    fullWidth
                  />
                ) : (
                  <CustomButton
                    title="START GAME"
                    onPress={handleStartGame}
                    leftIcon={<Icon name="play-arrow" size={20} color={theme.colors.text.primary} />}
                    loading={loading}
                    disabled={actualPlayers.length < requiredPlayers}
                    style={styles.actionButton}
                    fullWidth
                  />
                )}
                
                <View style={styles.rowButtonContainer}>
                  <CustomButton
                    title="END GAME"
                    onPress={handleEndGameConfirmation}
                    variant="outline"
                    style={styles.actionButton}
                    leftIcon={<Icon name="close" size={20} color={theme.colors.error} />}
                    fullWidth   
                  />
                  <CustomButton
                    title="BACK TO HOME"
                    onPress={() => navigation.navigate('Home')}
                    variant="outline"
                    style={styles.backButton}
                    leftIcon={<Icon name="home" size={20} color={theme.colors.primary} />}
                    fullWidth
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.playerCountContainer}>
                  <Text style={styles.playerCountText}>
                    Players: {actualPlayers.length}/{requiredPlayers}
                  </Text>
                  <Text style={styles.waitingText}>
                    {actualPlayers.length < requiredPlayers
                      ? `Waiting for ${requiredPlayers - actualPlayers.length} more player(s)...` 
                      : 'All players have joined! Waiting for host to start the game.'}
                  </Text>
                </View>
                <View style={styles.rowButtonContainer}>
                  <CustomButton
                    title="LEAVE GAME"
                    onPress={handleLeaveGame}
                    variant="outline"
                    style={styles.leaveButton}
                    leftIcon={<Icon name="exit-to-app" size={20} color={theme.colors.error} />}
                    fullWidth
                  />
                  <CustomButton
                    title="BACK TO HOME"
                    onPress={() => navigation.navigate('Home')}
                    variant="outline"
                    style={styles.backButton}
                    leftIcon={<Icon name="home" size={20} color={theme.colors.primary} />}
                    fullWidth
                  />
                </View>
              </>
            )}
          </View>
        </View>

        {/* Confirmation Modal for Web */}
        {confirmationVisible && playerToRemove && (
          <View style={styles.confirmationOverlay}>
            <View style={styles.confirmationModal}>
              <Text style={styles.confirmationTitle}>Remove Player</Text>
              <Text style={styles.confirmationText}>
                Are you sure you want to remove {playerToRemove.name} from the game?
              </Text>
              <View style={styles.confirmationButtons}>
                <TouchableOpacity 
                  style={[styles.confirmationButton, styles.cancelButton]} 
                  onPress={cancelRemovePlayer}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.confirmationButton, styles.removeButton]} 
                  onPress={confirmRemovePlayer}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ModernBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  gradientContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.horizontalPadding,
    paddingBottom: theme.spacing.bottomNavHeight + theme.spacing.safeBottom,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginVertical: theme.spacing.sm,
    // Text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  gameCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    ...theme.shadows.small,
  },
  gameCodeLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.secondary,
    marginRight: theme.spacing.md,
  },
  gameCode: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    letterSpacing: 3,
  },
  subTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
  },
  hostText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontWeight: theme.typography.weights.bold,
  },
  hostLabel: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
  },
  cardContainer: {
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  playersList: {
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginBottom: theme.spacing.md,
    height:170,

  },
  playersListContent: {
    padding: theme.spacing.sm,
  },
  playerItem: {
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.15)',
  },
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  playerAvatar: {
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  playerName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  youLabel: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
    fontStyle: 'italic',
  },
  removePlayerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 55, 55, 0.1)',
  },
  hostPlayerItem: {
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    borderColor: theme.colors.primary + '60',
  },
  hostName: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
  },
  buttonContainer: {
    marginTop: theme.spacing.xs,
  },
  leaveButton: {
    marginTop: theme.spacing.xs,
    borderColor: theme.colors.error,
  },
  waitingContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  waitingText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.md,
    padding: theme.spacing.md,
    fontStyle: 'italic',
  },
  leaveGameText: {
    color: theme.colors.error,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    ...theme.shadows.small,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  playersSection: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  endGameButton: {
    marginTop: theme.spacing.xs,
    borderColor: theme.colors.error,
  },
  copyIcon: {
    marginLeft: 8,
  },
  backButton: {
    marginTop: theme.spacing.xs,
  },
  hostInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    ...theme.shadows.small,
  },
  hostInfoText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
  },
  civilianInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  playerCountContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    ...theme.shadows.small,
  },
  playerCountText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  actionButton: {
    marginTop: theme.spacing.xs,
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
  confirmationModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.background.tertiary,
  },
  cancelButtonText: {
    color: theme.colors.text.primary,
    fontWeight: 'bold',
  },
  removeButtonText: {
    color: theme.colors.text.primary,
    fontWeight: 'bold',
  },
  rowButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
});

export default GameLobbyScreen;
