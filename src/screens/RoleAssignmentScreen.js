import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/gameService';
import { useError } from '../context/ErrorContext';

const RoleCard = ({ role, name, description, icon }) => {
  // Get role color based on role type
  const getRoleColor = (roleType) => {
    switch (roleType.toLowerCase()) {
      case 'mafia':
        return theme.colors.tertiary;
      case 'detective':
        return theme.colors.info;
      case 'doctor':
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  };

  const roleColor = getRoleColor(role);

  return (
    <View style={styles.roleCard}>
      <LinearGradient
        colors={[`${roleColor}40`, `${roleColor}20`]}
        style={styles.cardGradient}
      >
        <View style={[styles.roleIconContainer, { backgroundColor: `${roleColor}30` }]}>
          <Icon name={icon} size={28} color={roleColor} />
        </View>
        <View style={styles.roleContent}>
          <Text style={styles.playerName}>{name}</Text>
          <Text style={[styles.roleName, { color: roleColor }]}>{role}</Text>
          <Text style={styles.roleDescription}>{description}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const RoleAssignmentScreen = ({ route, navigation }) => {
  const { gameCode, isHost } = route.params || {};
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { showError } = useError();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        if (!gameCode) {
          setLoading(false);
          return;
        }
        
        // This would be replaced with actual API call to get roles
        const gameRoles = await gameService.getGameRoles(gameCode);
        
        // Sort roles - Mafia, Detective, Doctor, then Civilian
        const sortedRoles = [...gameRoles].sort((a, b) => {
          const roleOrder = {
            'Mafia': 1,
            'Detective': 2,
            'Doctor': 3,
            'Civilian': 4
          };
          
          // If roles have a defined order, sort by that order
          if (roleOrder[a.role] && roleOrder[b.role]) {
            return roleOrder[a.role] - roleOrder[b.role];
          }
          
          // If only one has a defined order, put it first
          if (roleOrder[a.role]) return -1;
          if (roleOrder[b.role]) return 1;
          
          // Otherwise alphabetical sort
          return a.role.localeCompare(b.role);
        });
        
        setRoles(sortedRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
        showError('Failed to fetch role assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [gameCode, showError]);

  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case 'mafia':
        return 'security';
      case 'detective':
        return 'search';
      case 'doctor':
        return 'healing';
      default:
        return 'people';
    }
  };

  const getRoleDescription = (role) => {
    switch (role.toLowerCase()) {
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

  const renderRoleItem = ({ item }) => (
    <RoleCard
      role={item.role}
      name={item.playerName}
      description={getRoleDescription(item.role)}
      icon={getRoleIcon(item.role)}
    />
  );

  const handleContinue = () => {
    // If the user is the host, they should go to GameControl
    if (isHost) {
      navigation.navigate('GameControl', { gameCode });
      return;
    }
    
    // Find current user's role in the roles array
    const currentUserRole = roles.find(r => r.playerId === user.uid)?.role || 'civilian';
    
    // Navigate to GamePlay with both gameCode and role
    navigation.navigate('GamePlay', { 
      gameCode, 
      role: currentUserRole 
    });
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
      showError('Failed to return to lobby: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={theme.gradients.background}
          style={[
            styles.gradientContainer,
            { paddingTop: insets.top }
          ]}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Role Assignment</Text>
            <Text style={styles.subtitle}>
              {isHost 
                ? 'As the host, you can see all player roles' 
                : 'Your role and abilities for this game'}
            </Text>

            <View style={styles.rolesContainer}>
              {loading ? (
                <Text style={styles.loadingText}>Loading roles...</Text>
              ) : roles.length > 0 ? (
                <FlatList
                  data={roles}
                  renderItem={renderRoleItem}
                  keyExtractor={(item, index) => `role-${index}`}
                  contentContainerStyle={styles.rolesList}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Icon name="error-outline" size={48} color={theme.colors.text.secondary} />
                  <Text style={styles.emptyText}>No role assignments found</Text>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                title="CONTINUE TO GAME"
                onPress={handleContinue}
                disabled={loading || roles.length === 0}
                leftIcon={<Icon name="play-arrow" size={20} color={theme.colors.text.primary} />}
                fullWidth
              />
              
              <CustomButton
                title="RETURN TO LOBBY"
                onPress={handleReturnToLobby}
                variant="outline"
                style={styles.backButton}
                leftIcon={<Icon name="meeting-room" size={20} color={theme.colors.text.accent} />}
                fullWidth
              />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
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
    paddingBottom: theme.spacing.safeBottom,
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
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  rolesContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  rolesList: {
    paddingBottom: theme.spacing.md,
  },
  roleCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
  },
  roleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  roleContent: {
    flex: 1,
  },
  playerName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  roleName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.xs,
  },
  roleDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  loadingText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    padding: theme.spacing.xl,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});

export default RoleAssignmentScreen; 