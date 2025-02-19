import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, ImageBackground, Modal, Button, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { gameService } from '../services/gameService';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/BottomNavigation';
import LoadingSpinner from '../components/LoadingSpinner';

const GameHistoryScreen = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [newStatus, setNewStatus] = useState('ended');

  const fetchGameHistory = async () => {
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
    } catch (error) {
      console.error('Error fetching game history:', error);
      setError('Failed to load game history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameHistory();
  }, []);

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

  const renderGameItem = ({ item }) => {
    const players = Object.values(item.players || {}).filter(player => player.id !== item.hostId);
    const playerCount = players.length;

    return (
      <View style={styles.historyItem}>
        <Text style={styles.gameCodeText}>
          Game: {item.gameCode || 'N/A'}
        </Text>
        <Text style={styles.hostText}>
          Host: <Text style={styles.hostName}>{item.hostName || 'Unknown'}</Text>
        </Text>
        <Text style={styles.timestampText}>
          Created: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
        </Text>
        <Text style={styles.playersText}>
          Players: {playerCount}
        </Text>
        <View style={styles.playersContainer}>
          {players.map((player) => (
            <View key={player.id} style={styles.playerRow}>
              <Text style={[
                styles.playerText,
                player.id === user.uid ? styles.currentPlayerText : null
              ]}>
                {player.name || 'Unknown'}
              </Text>
              {/* Show role only if the game status is "Ended" */}
              {item.status === 'ended' && (
                <Text style={styles.roleText}>
                  {player.role ? ` - ${player.role}` : ''}
                </Text>
              )}
            </View>
          ))}
        </View>
        <Text style={styles.statusText}>
          Status: <Text style={styles.statusLabel}>{(item.status || '').charAt(0).toUpperCase() + (item.status || '').slice(1)}</Text>
          {item.endReason === 'timeout' ? ' (Timed Out)' : ''}
        </Text>
        {item.endedAt && (
          <Text style={styles.timestampText}>
            Ended: {new Date(item.endedAt).toLocaleString()}
          </Text>
        )}
        {/* Show the button only if the status is not "Ended" */}
        {item.status !== 'ended' && (
          <Button
            title="Update Status"
            onPress={() => {
              setSelectedGame(item);
              setModalVisible(true);
            }}
            color={theme.colors.primary}
          />
        )}
        {/* Show the Back to Lobby button only if the status is not "Ended" */}
        {item.status !== 'ended' && (
          <Button
            title="Back to Lobby"
            onPress={() => navigation.navigate('GameLobby', {
              gameCode: item.gameCode,
              totalPlayers: item.totalPlayers,
              mafiaCount: item.mafiaCount,
              hasDetective: item.hasDetective,
              hasDoctor: item.hasDoctor,
              isHost: item.hostId === user.uid
            })}
            color={theme.colors.secondary}
          />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <ImageBackground
        source={require('../../assets/background.png')}
        style={theme.commonStyles.content}
        resizeMode="cover"
      >
        <LinearGradient
          colors={theme.gradients.background}
          style={theme.commonStyles.container}
        >
          <LoadingSpinner />
        </LinearGradient>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={theme.commonStyles.content}
      resizeMode="cover"
    >
      <LinearGradient
        colors={theme.gradients.background}
        style={theme.commonStyles.container}
      >
        <View style={theme.commonStyles.content}>
          <Text style={styles.title}>Game History</Text>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : games.length === 0 ? (
            <Text style={styles.noGamesText}>No games played yet</Text>
          ) : (
            <FlatList
              data={games}
              renderItem={renderGameItem}
              keyExtractor={item => item.gameCode}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>

        {/* Modal for updating game status */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Game Status</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new status"
              value={newStatus}
              editable={false}
            />
            <Button title="Update" onPress={handleUpdateStatus} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      </LinearGradient>
      <BottomNavigation navigation={navigation} activeScreen="GameHistory" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  listContainer: {
    paddingBottom: theme.spacing.xl,
  },
  historyItem: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card.background,
    borderRadius: 15,
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
  },
  gameCodeText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
  },
  hostText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  hostName: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  timestampText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  playersText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.accent,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  playersContainer: {
    marginBottom: theme.spacing.sm,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  playerText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  roleText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    flex: 1,
    textAlign: 'right', // Align role text to the right
  },
  currentPlayerText: {
    color: theme.colors.text.accent,
    fontWeight: theme.typography.weights.bold,
  },
  statusText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  statusLabel: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
  },
  loadingText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  noGamesText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  errorText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  input: {
    width: '80%',
    padding: theme.spacing.sm,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: theme.spacing.md,
  },
});

export default GameHistoryScreen;