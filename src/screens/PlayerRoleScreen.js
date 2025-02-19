import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, Modal, FlatList, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import theme from '../theme';
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/gameService';
import BottomNavigation from '../components/BottomNavigation';

const roleImages = {
  civilian: require('../../assets/civilian.png'),
  mafia: require('../../assets/mafia.png'),
  detective: require('../../assets/detective.png'),
  doctor: require('../../assets/doctor.png'),
};

const PlayerRoleScreen = ({ route, navigation }) => {
  const { role, isHost, gameCode } = route.params;
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [groupedPlayers, setGroupedPlayers] = useState({});

  // Convert role to lowercase for matching
  const normalizedRole = role ? role.toLowerCase() : '';
  
  console.log('Original Role:', role);
  console.log('Normalized Role:', normalizedRole);
  console.log('Image Source:', roleImages[normalizedRole]);

  const handleViewAllRoles = async () => {
    try {
      const gameData = await gameService.getGameData(gameCode);
      const players = Object.values(gameData.players).filter(player => !player.isHost);
      const grouped = players.reduce((acc, player) => {
        if (!acc[player.role]) {
          acc[player.role] = [];
        }
        acc[player.role].push(player);
        return acc;
      }, {});
      setGroupedPlayers(grouped);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching roles:', error);
      Alert.alert('Error', 'Failed to fetch player roles. Please try again.');
    }
  };

  const handleEndGame = async () => {
    try {
      await gameService.endGame(gameCode);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error ending game:', error);
      Alert.alert('Error', error.message || 'Failed to end game');
    }
  };

  const renderRoleSection = ({ item }) => {
    const roleName = item.key;
    const players = item.data;
    
    return (
      <View style={styles.roleSection}>
        <View style={styles.roleTitleContainer}>
          <Text style={styles.roleTitle}>{roleName}</Text>
          <Text style={styles.roleCount}>{players.length} {players.length === 1 ? 'Player' : 'Players'}</Text>
        </View>
        {players.map((player) => (
          <View key={player.id} style={styles.playerItem}>
            <Text style={styles.playerName}>{player.name}</Text>
          </View>
        ))}
      </View>
    );
  };

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
          <Text style={styles.title}>
            {isHost ? 'Game Started' : 'Your Role'}
          </Text>
          <View style={styles.roleContainer}>
            <Text style={styles.playerName}>
              {user.displayName}
            </Text>
            {isHost ? (
              <>
                <Text style={styles.hostText}>
                  You are the Game Host
                </Text>
                <Button
                  title="View All Roles"
                  onPress={handleViewAllRoles}
                  buttonStyle={styles.viewRolesButton}
                  titleStyle={styles.viewRolesButtonText}
                />
                <Button
                  title="End Game"
                  onPress={() => {
                    Alert.alert(
                      'End Game',
                      'Are you sure you want to end this game?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'End Game', 
                          onPress: handleEndGame,
                          style: 'destructive'
                        },
                      ]
                    );
                  }}
                  buttonStyle={styles.endGameButton}
                  titleStyle={styles.endGameButtonText}
                />
              </>
            ) : (
              <View style={styles.roleDisplay}>
                <Image 
                  source={roleImages[normalizedRole]} 
                  style={styles.roleImage}
                />
                <Text style={styles.roleText}>
                  You are a {role}
                </Text>
              </View>
            )}
          </View>

          {/* Modal for displaying all roles */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>All Player Roles</Text>
                <FlatList
                  data={Object.entries(groupedPlayers).map(([key, data]) => ({ key, data }))}
                  renderItem={renderRoleSection}
                  keyExtractor={item => item.key}
                  style={styles.rolesList}
                  contentContainerStyle={styles.rolesListContent}
                />
                <Button
                  title="Close"
                  onPress={() => setModalVisible(false)}
                  buttonStyle={styles.closeButton}
                  titleStyle={styles.closeButtonText}
                />
              </View>
            </View>
          </Modal>
        </View>

        {/* Add Bottom Navigation */}
        <BottomNavigation navigation={navigation} activeScreen="PlayerRole" />
      </LinearGradient>
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
  roleContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card.background,
    borderRadius: 15,
    alignItems: 'center',
  },
  playerName: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  roleDisplay: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  roleImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: theme.spacing.sm,
  },
  roleText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.accent,
    fontWeight: theme.typography.weights.bold,
  },
  hostText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  viewRolesButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginTop: theme.spacing.lg,
  },
  viewRolesButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: theme.colors.card.background,
    borderRadius: 15,
    padding: theme.spacing.lg,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  rolesList: {
    marginBottom: theme.spacing.lg,
  },
  rolesListContent: {
    paddingBottom: theme.spacing.md,
  },
  roleSection: {
    marginBottom: theme.spacing.lg,
    backgroundColor: 'rgba(187, 134, 252, 0.1)', // theme.colors.primary with opacity
    borderRadius: 10,
    padding: theme.spacing.md,
  },
  roleTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary + '40',
  },
  roleTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  roleCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  playerItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: theme.colors.error,
    borderRadius: 25,
    marginTop: theme.spacing.sm,
  },
  closeButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  endGameButton: {
    backgroundColor: theme.colors.error,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginTop: theme.spacing.md,
  },
  endGameButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
  },
});

export default PlayerRoleScreen; 