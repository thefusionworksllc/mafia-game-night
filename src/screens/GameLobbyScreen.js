import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ImageBackground, Alert, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme'; 
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/gameService';
import BottomNavigation from '../components/BottomNavigation';
import CustomButton from '../components/CustomButton';

const GameLobbyScreen = ({ route, navigation }) => {
  const { gameCode, totalPlayers, mafiaCount, hasDetective, hasDoctor, isHost } = route.params;
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Check if user is null and handle accordingly
  if (!user) {
    Alert.alert('Error', 'User not authenticated. Please log in.');
    navigation.navigate('Login'); // Redirect to LoginScreen
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
    try {
      await gameService.startGame(gameCode);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLeaveLobby = async () => {
    setLoading(true);
    try {
      await gameService.leaveGame(gameCode);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error leaving lobby:', error);
      Alert.alert('Error', error.message || 'Failed to leave lobby');
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Game Lobby</Text>
          <Text style={styles.gameCodeText}>Game Code: {gameCode}</Text>
                    
          {gameData?.hostName && (
            <Text style={styles.hostText}>
              {gameData.hostName} <Text style={styles.hostLabel}>(Host)</Text>
            </Text>
          )}

          <View style={styles.cardContainer}>
            <Text style={styles.subTitle}>Players List : {players.filter(player => !player.isHost).length}/{gameData?.settings?.totalPlayers || totalPlayers}</Text>
            <View style={styles.playersList}>
              <FlatList
                data={players.filter(player => !player.isHost)}
                renderItem={renderPlayer}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>Waiting for players to join...</Text>
                }
              />
            </View>
          </View>

          {isHost ? (
            <View style={styles.buttonContainer}>
              <CustomButton
                title="START GAME"
                onPress={handleStartGame}
                style={styles.button}
                loading={loading}
              />
              <CustomButton
                title="LEAVE GAME"
                onPress={() => {
                  Alert.alert(
                    'Leave Game',
                    'Are you sure you want to Leave this game?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Leave Game', 
                        onPress: handleEndGame,
                        style: 'destructive'
                      },
                    ]
                  );
                }}
                style={[styles.button, styles.endGameButton]}
                type="clear"
                titleStyle={styles.leaveGameText}
              />
            </View>
          ) : (
            <Text style={styles.waitingText}>Waiting for host to start the game...</Text>
          )}
          
            </View>
        
        
      </LinearGradient>
      <BottomNavigation navigation={navigation} activeScreen="GameLobby" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  subTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
  },
  gameCodeText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    padding: theme.spacing.sm,
    borderRadius: 10,
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
    borderRadius: 15,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  playersList: {
    maxHeight: 200,
  },
  playerItem: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.text.secondary + '40',
  },
  playerName: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  button: {
    marginVertical: theme.spacing.sm,
  },
  endGameButton: {
    borderColor: theme.colors.error,
  },
  waitingText: {
    textAlign: 'center',
    color: theme.colors.text.accent,
    fontSize: theme.typography.sizes.md,
    marginVertical: theme.spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.md,
    padding: theme.spacing.md,
  },
  playersText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  leaveGameText: {
    color: theme.colors.text.accent,
    fontSize: theme.typography.sizes.md,
  }
});

export default GameLobbyScreen;
