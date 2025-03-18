import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Alert, 
  FlatList,
  StatusBar,
  TouchableOpacity,
  BackHandler
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

  // Get actual players (excluding host)
  const actualPlayers = useMemo(() => {
    return players.filter(player => !player.isHost);
  }, [players]);

  // Get the required number of players for this game (excluding host)
  const requiredPlayers = useMemo(() => {
    // totalPlayers includes the host in the setting, so we subtract 1
    return totalPlayers - 1;
  }, [totalPlayers]);

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
        navigation.replace('GameHistory');
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
        navigation.replace('GameHistory');
        return;
      }

      // Check if game has started
      if (data.status === 'started') {
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
      navigation.navigate('GameHistory');
    } catch (error) {
      showError(error.message || 'Failed to leave the game');
    }
  };

  const handleEndGame = async () => {
    setLoading(true);
    try {
      await gameService.endGame(gameCode);
      showError('Game ended successfully', 'success');
      navigation.replace('GameHistory');
    } catch (error) {
      console.error('Error ending game:', error);
      showError(error.message || 'Failed to end game', 'error');
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

  // Sort players to show host at the top
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (a.isHost) return -1;
      if (b.isHost) return 1;
      return 0;
    });
  }, [players]);

  const renderPlayer = ({ item }) => (
    <View style={[styles.playerItem, item.isHost && styles.hostPlayerItem]}>
      <Text style={[styles.playerName, item.isHost && styles.hostName]}>
        {item.name} {item.isHost ? '(Host)' : ''}
      </Text>
    </View>
  );

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Game Lobby</Text>
            <TouchableOpacity 
              style={styles.gameCodeContainer}
              onPress={handleCopyGameCode}
              activeOpacity={0.7}
            >
              <Text style={styles.gameCodeLabel}>Game Code:</Text>
              <Text style={styles.gameCode}>{gameCode}</Text>
              <Icon name="content-copy" size={18} color={theme.colors.text.accent} style={styles.copyIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="people" size={24} color={theme.colors.primary} />
              <Text style={styles.infoText}>
                Players: {actualPlayers.length}/{requiredPlayers}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="security" size={24} color={theme.colors.tertiary} />
              <Text style={styles.infoText}>
                Mafia: {mafiaCount}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="visibility" size={24} color={theme.colors.info} />
              <Text style={styles.infoText}>
                Detective: {detectiveCount}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="healing" size={24} color={theme.colors.success} />
              <Text style={styles.infoText}>
                Doctor: {doctorCount}
              </Text>
            </View>
          </View>

          <View style={styles.playersSection}>
            <Text style={styles.sectionTitle}>Participants</Text>
            <FlatList
              data={sortedPlayers}
              keyExtractor={(item) => item.id}
              renderItem={renderPlayer}
              contentContainerStyle={styles.playersList}
            />
          </View>

          <View style={styles.buttonContainer}>
            {isHost ? (
              <>
                <CustomButton
                  title="START GAME"
                  onPress={handleStartGame}
                  loading={loading}
                  disabled={actualPlayers.length < requiredPlayers || loading}
                  leftIcon={<Icon name="play-arrow" size={20} color={theme.colors.text.primary} />}
                  fullWidth
                />
                <Text style={styles.waitingText}>
                  {actualPlayers.length < requiredPlayers
                    ? `Waiting for ${requiredPlayers - actualPlayers.length} more player(s)...` 
                    : 'All players have joined! You can start the game.'}
                </Text>
                <CustomButton
                  title="END GAME"
                  onPress={handleEndGame}
                  variant="outline"
                  style={styles.endGameButton}
                  leftIcon={<Icon name="cancel" size={20} color={theme.colors.error} />}
                  fullWidth
                />
                <CustomButton
                  title="RETURN TO HISTORY"
                  onPress={() => navigation.navigate('GameHistory')}
                  variant="outline"
                  style={styles.backButton}
                  leftIcon={<Icon name="history" size={20} color={theme.colors.text.accent} />}
                  fullWidth
                />
              </>
            ) : (
              <>
                <Text style={styles.waitingText}>
                  {actualPlayers.length < requiredPlayers
                    ? `Waiting for ${requiredPlayers - actualPlayers.length} more player(s)...` 
                    : 'All players have joined! Waiting for host to start the game.'}
                </Text>
                <CustomButton
                  title="LEAVE GAME"
                  onPress={handleLeaveGame}
                  variant="outline"
                  style={styles.leaveButton}
                  leftIcon={<Icon name="exit-to-app" size={20} color={theme.colors.error} />}
                  fullWidth
                />
                <CustomButton
                  title="RETURN TO HISTORY"
                  onPress={() => navigation.navigate('GameHistory')}
                  variant="outline"
                  style={styles.backButton}
                  leftIcon={<Icon name="history" size={20} color={theme.colors.text.accent} />}
                  fullWidth
                />
              </>
            )}
          </View>
        </View>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="Home" />
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
    marginVertical: theme.spacing.lg,
    // Text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  gameCodeContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  gameCodeText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
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
    marginVertical: theme.spacing.md,
    ...theme.shadows.medium,
  },
  playersList: {
    maxHeight: 200,
  },
  playerItem: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.text.secondary + '40',
  },
  hostPlayerItem: {
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    borderColor: theme.colors.primary + '60',
  },
  playerName: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
  hostName: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  leaveButton: {
    marginTop: theme.spacing.md,
    borderColor: theme.colors.error,
  },
  waitingContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  waitingText: {
    textAlign: 'center',
    color: theme.colors.text.accent,
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.md,
    padding: theme.spacing.md,
  },
  leaveGameText: {
    color: theme.colors.error,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  gameCodeContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  gameCodeLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
  gameCode: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
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
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
  },
  endGameButton: {
    marginTop: theme.spacing.md,
    borderColor: theme.colors.error,
  },
  copyIcon: {
    marginLeft: 8,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});

export default GameLobbyScreen;
