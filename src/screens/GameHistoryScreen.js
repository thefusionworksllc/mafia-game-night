import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Modal, TouchableOpacity, TextInput, StatusBar, Dimensions } from 'react-native';
import theme from '../theme';
import { gameService } from '../services/gameService';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/BottomNavigation';
import LoadingSpinner from '../components/LoadingSpinner';
import ModernBackground from '../components/ModernBackground';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { useError } from '../context/ErrorContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const GameHistoryScreen = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [newStatus, setNewStatus] = useState('ended');
  const insets = useSafeAreaInsets();
  const { showError } = useError();

  const fetchGameHistory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching game history...');
      const gameHistory = await gameService.getAllGameHistory();
      console.log('Fetched game history:', gameHistory);
      const sortedGames = gameHistory.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setGames(sortedGames);
      if (sortedGames.length === 0) {
        showError('No game history found', 'info');
      }
    } catch (err) {
      console.error('Error fetching game history:', err);
      setError(err.message || 'Failed to load game history');
      showError('Failed to load game history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameHistory();
  }, [user]);

  const handleUpdateStatus = async () => {
    if (selectedGame) {
      try {
        console.log('Updating status for game:', selectedGame.gameCode);
        await gameService.updateGameStatus(selectedGame.gameCode, newStatus);
        setModalVisible(false);
        setNewStatus('ended');
        // Refresh the game history
        await fetchGameHistory();
      } catch (error) {
        console.error('Error updating game status:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active':
        return theme.colors.success;
      case 'waiting':
        return theme.colors.warning;
      case 'ended':
        return theme.colors.tertiary;
      default:
        return theme.colors.info;
    }
  };

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
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

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
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

  const handleRejoinGame = async (gameCode) => {
    setLoading(true);
    try {
      const gameExists = await gameService.checkGameExists(gameCode);
      if (!gameExists) {
        showError('This game is no longer active');
        return;
      }
      
      navigation.navigate('GameLobby', { 
        gameCode,
        isHost: false,
      });
    } catch (error) {
      showError(error.message || 'Failed to rejoin game');
    } finally {
      setLoading(false);
    }
  };

  const renderGameItem = ({ item }) => {
    const players = Object.values(item.players || {}).filter(player => player.id !== item.hostId);
    const playerCount = players.length;
    const statusColor = getStatusColor(item.status);
    const currentPlayerRole = item.players && item.players[user.uid]?.role;

    return (
      <View style={styles.historyItemContainer}>
        <LinearGradient
          colors={['rgba(30, 30, 50, 0.8)', 'rgba(20, 20, 35, 0.9)']}
          style={styles.historyItemGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Game Header */}
          <View style={styles.gameHeader}>
            <View style={styles.gameCodeContainer}>
              <Icon name="games" size={24} color={theme.colors.primary} style={styles.gameCodeIcon} />
              <Text style={styles.gameCodeText}>
                {item.gameCode || 'N/A'}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}40` }]}>
              <Icon name={item.status === 'ended' ? 'check-circle' : 'schedule'} size={16} color={statusColor} />
              <Text style={[styles.statusLabel, { color: statusColor }]}>
                {(item.status || '').charAt(0).toUpperCase() + (item.status || '').slice(1)}
                {item.endReason === 'timeout' ? ' (Timed Out)' : ''}
              </Text>
            </View>
          </View>

          {/* Game Info */}
          <View style={styles.gameInfoContainer}>
            <View style={styles.infoRow}>
              <Icon name="person" size={18} color={theme.colors.primary} />
              <Text style={styles.hostText}>
                Host: <Text style={styles.hostName}>{item.hostName || 'Unknown'}</Text>
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="event" size={18} color={theme.colors.info} />
              <Text style={styles.timestampText}>
                Created: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
              </Text>
            </View>
            
            {item.endedAt && (
              <View style={styles.infoRow}>
                <Icon name="event-completed" size={18} color={theme.colors.warning} />
                <Text style={styles.timestampText}>
                  Ended: {new Date(item.endedAt).toLocaleString()}
                </Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Icon name="group" size={18} color={theme.colors.success} />
              <Text style={styles.playersText}>
                Players: {playerCount}
              </Text>
            </View>

            {/* Show current player's role if game is started or ended */}
            {(item.status === 'started' || item.status === 'ended') && currentPlayerRole && (
              <View style={styles.infoRow}>
                <Icon name={getRoleIcon(currentPlayerRole)} size={18} color={getRoleColor(currentPlayerRole)} />
                <Text style={styles.roleText}>
                  Your Role: <Text style={[styles.roleName, { color: getRoleColor(currentPlayerRole) }]}>{currentPlayerRole}</Text>
                </Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Players List - Only show players, not their roles */}
          <Text style={styles.sectionTitle}>Players</Text>
          <View style={styles.playersContainer}>
            {players.map((player) => (
              <View key={player.id} style={styles.playerRow}>
                <Text style={[
                  styles.playerText,
                  player.id === user.uid ? styles.currentPlayerText : null
                ]}>
                  {player.name || 'Unknown'}
                </Text>
                {/* Show role only if this is the current user OR host views ended game */}
                {item.status === 'ended' && player.role && player.id === user.uid && (
                  <View style={styles.roleContainer}>
                    <View style={[styles.roleIconContainer, { backgroundColor: `${getRoleColor(player.role)}40` }]}>
                      <Icon name={getRoleIcon(player.role)} size={16} color={getRoleColor(player.role)} />
                    </View>
                    <Text style={[styles.roleText, { color: getRoleColor(player.role) }]}>
                      {player.role}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          {item.status !== 'ended' && (
            <View style={styles.actionButtonsContainer}>
              {item.hostId === user.uid && (
                <CustomButton
                  title="End Game"
                  onPress={() => {
                    setSelectedGame(item);
                    setModalVisible(true);
                  }}
                  variant="outline"
                  style={styles.actionButton}
                  leftIcon={<Icon name="stop" size={18} color={theme.colors.error} />}
                />
              )}
              
              <CustomButton
                title="Return to Lobby"
                onPress={() => handleRejoinGame(item.gameCode)}
                style={styles.actionButton}
                leftIcon={<Icon name="meeting-room" size={18} color={theme.colors.text.primary} />}
              />
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={theme.commonStyles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ModernBackground>
          <LoadingSpinner />
        </ModernBackground>
      </View>
    );
  }

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <View style={[theme.commonStyles.content, { paddingTop: insets.top + theme.spacing.md }]}>
          <Text style={styles.title}>Game History</Text>
          <Text style={styles.subtitle}>View your past and ongoing games</Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="error-outline" size={48} color={theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <CustomButton 
                title="Try Again" 
                onPress={fetchGameHistory}
                style={styles.retryButton}
              />
            </View>
          ) : !user ? (
            <View style={styles.emptyStateContainer}>
              <Icon name="login" size={64} color={theme.colors.primary} />
              <Text style={styles.emptyStateText}>Please log in to view your game history</Text>
              <CustomButton 
                title="Login" 
                onPress={() => navigation.navigate('Login')}
                style={styles.loginButton}
              />
            </View>
          ) : games.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Icon name="history" size={64} color={theme.colors.primary} />
              <Text style={styles.emptyStateText}>No games played yet</Text>
              <CustomButton 
                title="Host a Game" 
                onPress={() => navigation.navigate('HostGame')}
                style={styles.hostButton}
                leftIcon={<Icon name="add" size={20} color={theme.colors.text.primary} />}
              />
            </View>
          ) : (
            <FlatList
              data={games}
              renderItem={renderGameItem}
              keyExtractor={item => item.gameCode}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Modal for updating game status */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <LinearGradient
                colors={['#2c3e50', '#1a2530']}
                style={styles.modalGradient}
              >
                <Text style={styles.modalTitle}>End Game</Text>
                <Text style={styles.modalSubtitle}>
                  Are you sure you want to end game {selectedGame?.gameCode}?
                </Text>
                
                <View style={styles.modalButtonsContainer}>
                  <CustomButton 
                    title="End Game" 
                    onPress={handleUpdateStatus}
                    style={styles.confirmButton}
                    leftIcon={<Icon name="check" size={20} color={theme.colors.text.primary} />}
                  />
                  <CustomButton 
                    title="Cancel" 
                    onPress={() => setModalVisible(false)}
                    variant="outline"
                    style={styles.cancelButton}
                    leftIcon={<Icon name="close" size={20} color={theme.colors.text.accent} />}
                  />
                </View>
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="GameHistory" />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  listContainer: {
    paddingBottom: theme.spacing.xxl,
  },
  historyItemContainer: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    alignSelf: 'center',
    ...theme.shadows.medium,
  },
  historyItemGradient: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  gameCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameCodeIcon: {
    marginRight: theme.spacing.xs,
  },
  gameCodeText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
  },
  statusLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    marginLeft: theme.spacing.xs,
  },
  gameInfoContainer: {
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  hostText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  hostName: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  timestampText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  playersText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
  },
  playersContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  roleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  playerText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  roleText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'right',
  },
  currentPlayerText: {
    color: theme.colors.text.accent,
    fontWeight: theme.typography.weights.bold,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  retryButton: {
    width: 200,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  emptyStateText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  loginButton: {
    width: 200,
  },
  hostButton: {
    width: 200,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.large,
  },
  modalGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'column',
  },
  confirmButton: {
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleName: {
    fontWeight: theme.typography.weights.bold,
  },
});

export default GameHistoryScreen;