import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Modal, 
  FlatList, 
  Alert, 
  Image, 
  StatusBar,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/gameService';
import BottomNavigation from '../components/BottomNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import ModernBackground from '../components/ModernBackground';
import { useError } from '../context/ErrorContext';

const roleImages = {
  civilian: require('../../assets/roles/civilian.png'),
  mafia: require('../../assets/roles/mafia.png'),
  detective: require('../../assets/roles/detective.png'),
  doctor: require('../../assets/roles/doctor.png'),
};

const roleIcons = {
  civilian: 'people',
  mafia: 'person',
  detective: 'visibility',
  doctor: 'healing',
};

const PlayerRoleScreen = ({ route, navigation }) => {
  const { role = 'civilian', isHost = false, gameCode } = route.params || {};
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showError } = useError();
  const [modalVisible, setModalVisible] = useState(false);
  const [groupedPlayers, setGroupedPlayers] = useState({});
  const insets = useSafeAreaInsets();
  const [gameData, setGameData] = useState(null);

  // Convert role to lowercase for matching
  const normalizedRole = role ? role.toLowerCase() : '';
  
  console.log('Original Role:', role);
  console.log('Normalized Role:', normalizedRole);
  console.log('Image Source:', roleImages[normalizedRole]);

  // Role displays
  const roleData = {
    civilian: {
      name: 'Civilian',
      icon: 'people',
      color: theme.colors.civilian,
      description: 'Your goal is to work with other civilians to identify and eliminate the mafia during the day phase.',
      ability: 'You can vote during the day phase to eliminate suspected mafia members.'
    },
    mafia: {
      name: 'Mafia',
      icon: 'security',
      color: theme.colors.mafia,
      description: 'Your goal is to eliminate all civilians without being detected.',
      ability: 'During the night phase, you and your fellow mafia members can choose a civilian to eliminate.'
    },
    detective: {
      name: 'Detective',
      icon: 'search',
      color: theme.colors.detective,
      description: 'Your goal is to identify the mafia and help the civilians eliminate them.',
      ability: 'During the night phase, you can investigate one player to discover if they are a mafia member.'
    },
    doctor: {
      name: 'Doctor',
      icon: 'healing',
      color: theme.colors.doctor,
      description: 'Your goal is to protect civilians from the mafia\'s attacks.',
      ability: 'During the night phase, you can choose one player to protect from elimination.'
    }
  };

  // Function to get role color based on role name
  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'mafia':
        return theme.colors.mafia;
      case 'detective':
        return theme.colors.detective;
      case 'doctor':
        return theme.colors.doctor;
      case 'civilian':
        return theme.colors.civilian;
      default:
        return theme.colors.primary;
    }
  };

  // Function to get role description based on role name
  const getRoleDescription = (role) => {
    const normalizedRole = role?.toLowerCase();
    if (roleData[normalizedRole]) {
      return roleData[normalizedRole].description;
    }
    switch(normalizedRole) {
      case 'mafia':
        return 'Eliminate civilians without being caught';
      case 'detective':
        return 'Investigate players to find the mafia';
      case 'doctor':
        return 'Save one player each night from elimination';
      default:
        return 'Vote to eliminate suspected mafia members';
    }
  };

  const handleViewAllRoles = async () => {
    try {
      // Navigate to the RoleAssignmentScreen instead of showing modal
      navigation.navigate('RoleAssignment', {
        gameCode,
        isHost: true,
        fromPlayerRole: true // Flag to indicate we came from PlayerRoleScreen
      });
    } catch (error) {
      console.error('Error navigating to roles screen:', error);
      showError('Failed to navigate to role assignment screen. Please try again.');
    }
  };

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

  const handleViewGameHistory = () => {
    navigation.navigate('GameHistory');
  };

  // Function to get game data
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const data = await gameService.getGameData(gameCode);
        setGameData(data);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchGameData();
  }, [gameCode]);

  const renderRoleSection = ({ item }) => {
    const roleName = item.key;
    const players = item.data;
    const normalizedRoleName = roleName.toLowerCase();
    
    return (
      <View style={styles.roleSection}>
        <LinearGradient
          colors={['rgba(35, 35, 60, 0.75)', 'rgba(25, 25, 45, 0.85)']}
          style={styles.roleSectionGradient}
        >
          <View style={styles.roleTitleContainer}>
            <View style={styles.roleIconContainer}>
              <Icon 
                name={roleIcons[normalizedRoleName] || 'person'} 
                size={24} 
                color={theme.colors.primary} 
              />
            </View>
            <View style={styles.roleTitleContent}>
              <Text style={styles.roleTitle}>{roleName}</Text>
              <Text style={styles.roleCount}>{players.length} {players.length === 1 ? 'Player' : 'Players'}</Text>
            </View>
          </View>
          
          {players.map((player) => (
            <View key={player.id} style={styles.playerItem}>
              <Text style={styles.playerName}>{player.name}</Text>
            </View>
          ))}
        </LinearGradient>
      </View>
    );
  };

  const handleContinueToGame = () => {
    navigation.navigate('GamePlay', { 
      gameCode,
      role: normalizedRole
    });
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
            {isHost ? 'Game Started' : 'Your Role'}
          </Text>
          
          {isHost ? (
            <View style={styles.hostContainer}>
              <Icon name="stars" size={48} color={theme.colors.primary} />
              <Text style={styles.hostTitle}>You are the Host</Text>
              <Text style={styles.hostName}>{user?.displayName || 'Unknown'}</Text>
              <Text style={styles.hostDescription}>
                As the host, you will guide players through the game and see all roles.
              </Text>
              {isHost && (
                <CustomButton
                  title="VIEW ALL ROLES"
                  onPress={handleViewAllRoles}
                  leftIcon={<Icon name="visibility" size={20} color={theme.colors.text.primary} />}
                  style={styles.viewRolesButton}
                />
              )}
            </View>
          ) : (
            <View style={styles.playerContainer}>
              <Text style={styles.playerName}>{user?.displayName || 'Unknown'}</Text>
              <View style={[styles.roleInfoCard, { borderColor: getRoleColor(normalizedRole) }]}>
                <LinearGradient
                  colors={[`${getRoleColor(normalizedRole)}40`, `${getRoleColor(normalizedRole)}15`]}
                  style={styles.roleGradient}
                >
                  <View style={styles.roleImageContainer}>
                    <Image 
                      source={roleImages[normalizedRole]} 
                      style={styles.roleImage} 
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.roleName, { color: getRoleColor(normalizedRole) }]}>
                    {roleData[normalizedRole]?.name || role}
                  </Text>
                  <View style={styles.divider} />
                  <Text style={styles.roleDescription}>
                    {roleData[normalizedRole]?.description || 'No description available.'}
                  </Text>
                  <View style={styles.abilityContainer}>
                    <Icon name="flash-on" size={24} color={getRoleColor(normalizedRole)} />
                    <Text style={styles.abilityTitle}>Your Ability:</Text>
                  </View>
                  <Text style={styles.abilityText}>
                    {roleData[normalizedRole]?.ability || 'No special ability.'}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Modal to view all roles */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <LinearGradient
                  colors={['rgba(35, 35, 60, 0.95)', 'rgba(25, 25, 45, 0.98)']}
                  style={styles.modalGradient}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>All Player Roles</Text>
                    <TouchableOpacity 
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Icon name="close" size={24} color={theme.colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                  
                  <FlatList
                    data={Object.entries(groupedPlayers).map(([key, value]) => ({
                      key,
                      data: value
                    }))}
                    renderItem={renderRoleSection}
                    keyExtractor={(item) => item.key}
                    style={styles.modalList}
                    contentContainerStyle={styles.modalListContent}
                  />
                </LinearGradient>
              </View>
            </View>
          </Modal>
          
          <View style={styles.buttonContainer}>
            <CustomButton
              title="CONTINUE TO GAME"
              onPress={handleContinueToGame}
              leftIcon={<Icon name="play-arrow" size={20} color={theme.colors.text.primary} />}
              fullWidth
              style={styles.actionButton}
            />
            {/*
            <CustomButton
              title="RETURN TO LOBBY"
              onPress={handleReturnToLobby}
              variant="outline"
              leftIcon={<Icon name="meeting-room" size={20} color={theme.colors.text.accent} />}
              fullWidth
              style={styles.actionButton}
            />
          
            
            <CustomButton
              title="BACK TO HISTORY"
              onPress={handleViewGameHistory}
              variant="outline"
              leftIcon={<Icon name="history" size={20} color={theme.colors.text.accent} />}
              fullWidth
              style={styles.historyButton}
            />
              */}
            {isHost && (
              <CustomButton
                title="END GAME"
                onPress={handleEndGame}
                variant="outline"
                style={styles.endGameButton}
                leftIcon={<Icon name="stop" size={20} color={theme.colors.error} />}
                fullWidth
              />
            )}
          </View>
        </ScrollView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  roleContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  playerNameText: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    fontWeight: theme.typography.weights.bold,
  },
  roleDisplay: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    width: '100%',
  },
  roleImageContainer: {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  roleImage: {
    width: 150,
    height: 150,
    borderRadius: theme.borderRadius.medium,
  },
  roleText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  roleName: {
    color: theme.colors.text.accent,
    fontWeight: theme.typography.weights.bold,
  },
  roleDescriptionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    width: '100%',
    marginTop: theme.spacing.sm,
  },
  roleDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
   // lineHeight: theme.typography.lineHeights.relaxed,
  },
  hostText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  buttonContainer: {
    width: '100%',
    marginTop: theme.spacing.md,
  },
  endGameButton: {
    marginTop: theme.spacing.md,
    borderColor: theme.colors.error,
  },
  endGameButtonText: {
    color: theme.colors.error,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    width: '100%',
    maxHeight: '80%',
    ...theme.shadows.large,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  rolesList: {
    marginBottom: theme.spacing.lg,
  },
  rolesListContent: {
    paddingBottom: theme.spacing.md,
  },
  roleSection: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  roleSectionGradient: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
  },
  roleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  roleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  roleTitleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  roleCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  playerItem: {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.xs,
  },
  playerName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  hostContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    ...theme.shadows.small,
  },
  hostTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginTop: theme.spacing.md,
  },
  hostName: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
  },
  hostDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  viewRolesButton: {
    marginTop: theme.spacing.sm,
  },
  playerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  roleInfoCard: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    marginVertical: theme.spacing.md,
    ...theme.shadows.medium,
  },
  roleGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  roleImageContainer: {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  roleImage: {
    width: 150,
    height: 150,
    borderRadius: theme.borderRadius.medium,
  },
  roleName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    marginBottom: theme.spacing.md,
  },
  roleDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  abilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  abilityTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  abilityText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  buttonContainer: {
    width: '100%',
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
  endGameButton: {
    marginTop: theme.spacing.sm,
    borderColor: theme.colors.error,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: theme.borderRadius.large,
    width: '90%',
    maxHeight: '80%',
    ...theme.shadows.large,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  modalGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
    paddingBottom: theme.spacing.sm,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  historyButton: {
    marginBottom: theme.spacing.md,
  },
});

export default PlayerRoleScreen; 