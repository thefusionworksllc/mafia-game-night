import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Alert, 
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { gameService } from '../services/gameService';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import ModernBackground from '../components/ModernBackground';
import { useError } from '../context/ErrorContext';

// Animated control component for all numeric inputs
const AnimatedControl = ({ 
  value, 
  label, 
  maxValue, 
  minValue = 1,
  onIncrement, 
  onDecrement,
  icon,
  description
}) => {
  const animatedValue = useState(new Animated.Value(1))[0];
  
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.controlContainer}>
      <View style={styles.controlHeader}>
        <View style={styles.controlIconContainer}>
          <Icon name={icon} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.controlLabelContainer}>
          <Text style={styles.controlLabel}>{label}</Text>
          <Text style={styles.controlDescription}>{description}</Text>
        </View>
      </View>
      
      <View style={styles.controlActions}>
        <TouchableOpacity 
          style={[
            styles.controlButton,
            value <= minValue && styles.controlButtonDisabled
          ]} 
          onPress={() => {
            if (value > minValue) {
              animatePress();
              onDecrement();
            }
          }}
          disabled={value <= minValue}
          activeOpacity={0.7}
        >
          <Icon 
            name="remove" 
            size={24} 
            color={value <= minValue ? theme.colors.text.disabled : theme.colors.text.secondary} 
          />
        </TouchableOpacity>
        
        <Animated.View 
          style={[
            styles.controlValueContainer,
            { transform: [{ scale: animatedValue }] }
          ]}
        >
          <Text style={styles.controlValue}>{value}</Text>
        </Animated.View>

        <TouchableOpacity 
          style={[
            styles.controlButton,
            value >= maxValue && styles.controlButtonDisabled
          ]} 
          onPress={() => {
            if (value < maxValue) {
              animatePress();
              onIncrement();
            }
          }}
          disabled={value >= maxValue}
          activeOpacity={0.7}
        >
          <Icon 
            name="add" 
            size={24} 
            color={value >= maxValue ? theme.colors.text.disabled : theme.colors.text.secondary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Role card component to display role information
const RoleCard = ({ role, count, icon, color, description }) => (
  <View style={styles.roleCard}>
    <LinearGradient
      colors={[`${color}20`, `${color}10`]}
      style={styles.roleCardGradient}
    >
      <View style={[styles.roleIconContainer, { backgroundColor: `${color}30` }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.roleInfoContainer}>
        <Text style={styles.roleName}>{role}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>
      <View style={styles.roleCountContainer}>
        <Text style={[styles.roleCount, { color }]}>{count}</Text>
      </View>
    </LinearGradient>
  </View>
);

const HostGameScreen = ({ navigation }) => {
  const [totalPlayers, setTotalPlayers] = useState(6);
  const [mafiaCount, setMafiaCount] = useState(2);
  const [maxMafia, setMaxMafia] = useState(Math.floor(6 / 3));
  const [detectiveCount, setDetectiveCount] = useState(1);
  const [doctorCount, setDoctorCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gameCode, setGameCode] = useState(null);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { showError } = useError();

  // Handle total players changes
  const handleTotalPlayersChange = (value) => {
    setTotalPlayers(value);
    const newMaxMafia = Math.floor(value / 3);
    setMaxMafia(newMaxMafia);
    // Adjust mafia count if it exceeds new maximum
    if (mafiaCount > newMaxMafia) {
      setMafiaCount(newMaxMafia);
    }
  };

  const incrementTotalPlayers = () => {
    if (totalPlayers < 12) {
      handleTotalPlayersChange(totalPlayers + 1);
    }
  };

  const decrementTotalPlayers = () => {
    if (totalPlayers > 4) {
      handleTotalPlayersChange(totalPlayers - 1);
    }
  };

  const incrementMafia = () => {
    if (mafiaCount < maxMafia) {
      setMafiaCount(mafiaCount + 1);
    }
  };

  const decrementMafia = () => {
    if (mafiaCount > 1) {
      setMafiaCount(mafiaCount - 1);
    }
  };

  // Detective count handlers
  const incrementDetective = () => {
    if (detectiveCount < 2) {
      setDetectiveCount(detectiveCount + 1);
    }
  };

  const decrementDetective = () => {
    if (detectiveCount > 0) {
      setDetectiveCount(detectiveCount - 1);
    }
  };

  // Doctor count handlers
  const incrementDoctor = () => {
    if (doctorCount < 2) {
      setDoctorCount(doctorCount + 1);
    }
  };

  const decrementDoctor = () => {
    if (doctorCount > 0) {
      setDoctorCount(doctorCount - 1);
    }
  };

  // Calculate remaining civilians
  const remainingCivilians = totalPlayers - mafiaCount - detectiveCount - doctorCount;

  const handleHostGame = async () => {
    if (!user) {
      showError('You need to log in to host a game', 'warning');
      Alert.alert(
        'Login Required',
        'You need to log in to host a game.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    // Validate player count
    if (totalPlayers < 4) {
      showError('You need at least 4 players to start a game');
      return;
    }

    // Check if mafia count is valid (between 1 and totalPlayers/3)
    if (mafiaCount < 1 || mafiaCount > Math.floor(totalPlayers / 3)) {
      showError(`Mafia count should be between 1 and ${Math.floor(totalPlayers / 3)}`);
      return;
    }

    setLoading(true);
    try {
      const gameCode = await gameService.createGame(
        totalPlayers,
        mafiaCount,
        detectiveCount,
        doctorCount
      );
      
      showError('Game created successfully!', 'success');
      
      navigation.navigate('GameLobby', {
        gameCode,
        totalPlayers,
        mafiaCount,
        detectiveCount,
        doctorCount,
        isHost: true,
      });
    } catch (error) {
      showError(error.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView 
            style={theme.commonStyles.scrollContainer}
            contentContainerStyle={theme.commonStyles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={theme.commonStyles.title}>Host Game</Text>
            
            {/* Game Settings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Game Settings</Text>
              
              {/* Total Players Control */}
              <AnimatedControl
                label="Total Players"
                value={totalPlayers}
                minValue={4}
                maxValue={12}
                onIncrement={incrementTotalPlayers}
                onDecrement={decrementTotalPlayers}
                icon="group"
                description="Number of players in the game (4-12)"
              />
              
              {/* Role Distribution */}
              
              <View style={styles.rolesContainer}>
                <View style={styles.roleControls}>
                  <AnimatedControl
                    label="Mafia Count"
                    value={mafiaCount}
                    minValue={1}
                    maxValue={Math.max(1, Math.floor(totalPlayers / 3))}
                    onIncrement={incrementMafia}
                    onDecrement={decrementMafia}
                    icon="security"
                    description={`Mafia players (1-${Math.max(1, Math.floor(totalPlayers / 3))})`}
                  />
                  
                  <AnimatedControl
                    label="Detective Count"
                    value={detectiveCount}
                    minValue={0}
                    maxValue={2}
                    onIncrement={incrementDetective}
                    onDecrement={decrementDetective}
                    icon="visibility"
                    description="Detectives can investigate players (0-2)"
                  />
                  
                  <AnimatedControl
                    label="Doctor Count"
                    value={doctorCount}
                    minValue={0}
                    maxValue={2}
                    onIncrement={incrementDoctor}
                    onDecrement={decrementDoctor}
                    icon="healing"
                    description="Doctors can save players (0-2)"
                  />
                </View>
              </View>
              
              {/* Role Summary */}
              <View style={styles.roleSummary}>
                <Text style={styles.roleSummaryTitle}>Role Summary</Text>
                <View style={styles.roleSummaryCards}>
                  <View style={styles.roleCard}>
                    <LinearGradient
                      colors={[`${theme.colors.tertiary}20`, `${theme.colors.tertiary}10`]}
                      style={styles.roleCardGradient}
                    >
                      <View style={[styles.roleIconContainer, { backgroundColor: `${theme.colors.tertiary}30` }]}>
                        <Icon name="security" size={24} color={theme.colors.tertiary} />
                      </View>
                      <Text style={styles.roleName}>Mafia</Text>
                      <View style={styles.roleCountContainer}>
                        <Text style={[styles.roleCount, { color: theme.colors.tertiary }]}>{mafiaCount}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.roleCard}>
                    <LinearGradient
                      colors={[`${theme.colors.info}20`, `${theme.colors.info}10`]}
                      style={styles.roleCardGradient}
                    >
                      <View style={[styles.roleIconContainer, { backgroundColor: `${theme.colors.info}30` }]}>
                        <Icon name="visibility" size={24} color={theme.colors.info} />
                      </View>
                      <Text style={styles.roleName}>Detective</Text>
                      <View style={styles.roleCountContainer}>
                        <Text style={[styles.roleCount, { color: theme.colors.info }]}>{detectiveCount}</Text>
                        {detectiveCount === 2 && (
                          <Text style={styles.maxLabel}>MAX</Text>
                        )}
                      </View>
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.roleCard}>
                    <LinearGradient
                      colors={[`${theme.colors.success}20`, `${theme.colors.success}10`]}
                      style={styles.roleCardGradient}
                    >
                      <View style={[styles.roleIconContainer, { backgroundColor: `${theme.colors.success}30` }]}>
                        <Icon name="healing" size={24} color={theme.colors.success} />
                      </View>
                      <Text style={styles.roleName}>Doctor</Text>
                      <View style={styles.roleCountContainer}>
                        <Text style={[styles.roleCount, { color: theme.colors.success }]}>{doctorCount}</Text>
                        {doctorCount === 2 && (
                          <Text style={styles.maxLabel}>MAX</Text>
                        )}
                      </View>
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.roleCard}>
                    <LinearGradient
                      colors={[`${theme.colors.primary}20`, `${theme.colors.primary}10`]}
                      style={styles.roleCardGradient}
                    >
                      <View style={[styles.roleIconContainer, { backgroundColor: `${theme.colors.primary}30` }]}>
                        <Icon name="people" size={24} color={theme.colors.primary} />
                      </View>
                      <Text style={styles.roleName}>Civilian</Text>
                      <View style={styles.roleCountContainer}>
                        <Text style={[styles.roleCount, { color: theme.colors.primary }]}>{totalPlayers - mafiaCount - detectiveCount - doctorCount}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                </View>
                
                {remainingCivilians < 1 && (
                  <Text style={styles.errorText}>
                    Not enough players for selected roles
                  </Text>
                )}
              </View>
            </View>
            
            {/* Host Game Button */}
            <View style={styles.buttonContainer}>
              <CustomButton
                title="HOST GAME"
                onPress={handleHostGame}
                loading={loading}
                disabled={loading || remainingCivilians < 1}
                leftIcon={<Icon name="play-arrow" size={20} color={theme.colors.text.primary} />}
                fullWidth
              />
              
              <CustomButton
                title="BACK TO HOME"
                onPress={() => navigation.navigate('Home')}
                variant="outline"
                style={styles.backButton}
                leftIcon={<Icon name="arrow-back" size={20} color={theme.colors.text.accent} />}
                fullWidth
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="HostGame" />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.xs,
  },
  roleDistributionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
  },
  rolesContainer: {
    marginBottom: theme.spacing.md,
  },
  roleControls: {
    flexDirection: 'column',
    width: '100%',
  },
  roleSummary: {
    marginBottom: theme.spacing.lg,
  },
  roleSummaryTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
  },
  roleSummaryCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  roleCard: {
    width: '45%',
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  roleCardGradient: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  roleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  roleName: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  roleCountContainer: {
    alignItems: 'center',
  },
  roleCount: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
  maxLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.warning,
    fontWeight: theme.typography.weights.bold,
    marginTop: 2,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.md,
    marginTop: theme.spacing.sm,
  },
  buttonContainer: {
    marginBottom: theme.spacing.xxl,
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  controlContainer: {
    marginBottom: theme.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  controlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  controlIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  controlLabelContainer: {
    flex: 1,
  },
  controlLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  controlDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  controlActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  controlButtonDisabled: {
    opacity: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  controlValueContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
  },
  controlMaxValue: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  roleInfoContainer: {
    flex: 1,
  },
  roleDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
});

export default HostGameScreen; 