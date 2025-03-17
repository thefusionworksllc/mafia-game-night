import React, { useState } from 'react';
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
  civilian: require('../../assets/civilian.png'),
  mafia: require('../../assets/mafia.png'),
  detective: require('../../assets/detective.png'),
  doctor: require('../../assets/doctor.png'),
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
      color: theme.colors.accent,
      description: 'Your goal is to work with other civilians to identify and eliminate the mafia during the day phase.',
      ability: 'You can vote during the day phase to eliminate suspected mafia members.'
    },
    mafia: {
      name: 'Mafia',
      icon: 'security',
      color: theme.colors.error,
      description: 'Your goal is to eliminate all civilians without being detected.',
      ability: 'During the night phase, you and your fellow mafia members can choose a civilian to eliminate.'
    },
    detective: {
      name: 'Detective',
      icon: 'search',
      color: theme.colors.info,
      description: 'Your goal is to identify the mafia and help the civilians eliminate them.',
      ability: 'During the night phase, you can investigate one player to discover if they are a mafia member.'
    },
    doctor: {
      name: 'Doctor',
      icon: 'healing',
      color: theme.colors.success,
      description: 'Your goal is to protect civilians from the mafia\'s attacks.',
      ability: 'During the night phase, you can choose one player to protect from elimination.'
    }
  };

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

  const handleContinue = () => {
    try {
      if (isHost) {
        // Host can control game phases
        navigation.replace('GameControl', { gameCode });
      } else {
        // Regular players go to game play screen
        navigation.replace('GamePlay', { 
          gameCode,
          role 
        });
      }
    } catch (error) {
      showError(error.message || 'Failed to continue to game');
    }
  };

  const renderRoleSection = ({ item }) => {
    const roleName = item.key;
    const players = item.data;
    const normalizedRoleName = roleName.toLowerCase();
    
    return (
      <View style={styles.roleSection}>
        <LinearGradient
          colors={theme.gradients.card}
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
              <Text style={styles.hostText}>
                You are the Game Host
              </Text>
              <Text style={styles.hostDescription}>
                As the host, you can see all player roles and monitor the game progress.
              </Text>
              
              <View style={styles.roleDistributionCard}>
                <Text style={styles.sectionTitle}>Role Distribution</Text>
                <View style={styles.rolesList}>
                  {Object.entries(groupedPlayers).map(([role, players]) => (
                    <View key={role} style={styles.roleGroup}>
                      <View style={styles.roleHeader}>
                        <Icon 
                          name={roleIcons[role.toLowerCase()] || 'person'} 
                          size={24} 
                          color={getRoleColor(role)}
                        />
                        <Text style={styles.roleName}>{role} ({players.length})</Text>
                      </View>
                      {players.map(player => (
                        <Text key={player.id} style={styles.playerName}>
                          {player.name}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
              
              <CustomButton
                title="VIEW PLAYER ACTIONS"
                onPress={() => setModalVisible(true)}
                style={styles.actionButton}
                leftIcon={<Icon name="visibility" size={20} color={theme.colors.text.primary} />}
              />
            </View>
          ) : (
            <View style={styles.playerContainer}>
              <View style={styles.roleCard}>
                <LinearGradient
                  colors={theme.gradients.card}
                  style={styles.roleCardGradient}
                >
                  <View style={styles.roleImageContainer}>
                    <Image 
                      source={roleImages[normalizedRole] || roleImages.civilian}
                      style={styles.roleImage}
                      resizeMode="contain"
                    />
                  </View>
                  
                  <Text style={styles.roleName}>
                    {role || 'Civilian'}
                  </Text>
                  
                  <Text style={styles.roleDescription}>
                    {getRoleDescription(normalizedRole)}
                  </Text>
                </LinearGradient>
              </View>
              
              <View style={styles.instructionsCard}>
                <Text style={styles.sectionTitle}>Your Objective</Text>
                <Text style={styles.instructionsText}>
                  {getRoleObjective(normalizedRole)}
                </Text>
              </View>
              
              <View style={styles.instructionsCard}>
                <Text style={styles.sectionTitle}>Game Instructions</Text>
                <Text style={styles.instructionsText}>
                  {getGameInstructions(normalizedRole)}
                </Text>
              </View>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <CustomButton
              title="CONTINUE TO GAME"
              onPress={handleContinue}
              style={styles.continueButton}
              leftIcon={<Icon name="play-arrow" size={20} color={theme.colors.text.primary} />}
            />
          </View>
        </ScrollView>
        
        {/* Modal for host to view player actions */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Player Actions</Text>
              
              {/* Modal content here */}
              
              <CustomButton
                title="CLOSE"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={styles.closeButton}
              />
            </View>
          </View>
        </Modal>
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
    lineHeight: theme.typography.lineHeights.relaxed,
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
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
  hostContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  hostDescription: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  roleDistributionCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
  },
  roleGroup: {
    marginBottom: theme.spacing.md,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionButton: {
    marginTop: theme.spacing.md,
  },
  playerContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  roleCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  roleCardGradient: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
  },
  instructionsCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  instructionsText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed,
  },
  continueButton: {
    marginTop: theme.spacing.md,
  },
  closeButton: {
    marginTop: theme.spacing.md,
  },
});

export default PlayerRoleScreen; 