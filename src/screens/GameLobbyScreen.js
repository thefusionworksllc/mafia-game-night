import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Alert, 
  FlatList,
  StatusBar,
  TouchableOpacity
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

  // Check if user is null and handle accordingly
  if (!user) {
    showError('You need to log in to access the game lobby', 'warning');
    navigation.replace('Login'); // Redirect to LoginScreen
    return null; // Prevent rendering the rest of the component
  }

  useEffect(() => {
    const unsubscribe = gameService.subscribeToGame(gameCode, (data) => {
      if (!data) {
        Alert.alert('Game Ended', 'The game has been ended by the host');
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
        Alert.alert('Game Ended', message);
        navigation.replace('Home');
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
  }, [gameCode, navigation, user.uid, isHost]);

  const handleStartGame = async () => {
    if (players.length < 4) {
      showError('At least 4 players are required to start the game', 'warning');
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
      navigation.navigate('Home');
    } catch (error) {
      showError(error.message || 'Failed to leave the game');
    }
  };

  const handleEndGame = async () => {
    setLoading(true);
    try {
      await gameService.endGame(gameCode);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error ending game:', error);
      Alert.alert('Error', error.message || 'Failed to end game');
    } finally {
      setLoading(false);
    }
  };

  const renderPlayer = ({ item }) => (
    <View style={styles.playerItem}>
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
            <View style={styles.gameCodeContainer}>
              <Text style={styles.gameCodeLabel}>Game Code:</Text>
              <Text style={styles.gameCode}>{gameCode}</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="people" size={24} color={theme.colors.primary} />
              <Text style={styles.infoText}>
                Players: {players.length}/{totalPlayers}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="security" size={24} color={theme.colors.tertiary} />
              <Text style={styles.infoText}>
                Mafia: {mafiaCount}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="search" size={24} color={theme.colors.info} />
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
            <Text style={styles.sectionTitle}>Players</Text>
            <FlatList
              data={players}
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
                  disabled={players.length < totalPlayers || loading}
                  leftIcon={<Icon name="play-arrow" size={20} color={theme.colors.text.primary} />}
                  fullWidth
                />
                <Text style={styles.waitingText}>
                  {players.length < totalPlayers 
                    ? `Waiting for ${totalPlayers - players.length} more player(s)...` 
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
              </>
            ) : (
              <>
                <Text style={styles.waitingText}>
                  {players.length < totalPlayers 
                    ? `Waiting for ${totalPlayers - players.length} more player(s)...` 
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
});

export default GameLobbyScreen;
