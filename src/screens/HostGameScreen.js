import React, { useState, useEffect, useRef } from 'react';
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
          <Icon name={icon} size={24} color={theme.colors.secondary} />
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
            size={28} 
            color={value <= minValue ? theme.colors.text.disabled : theme.colors.primary} 
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
            size={28} 
            color={value >= maxValue ? theme.colors.text.disabled : theme.colors.primary} 
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
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  
  // Calculate civilian count based on other roles
  const civilianCount = totalPlayers - mafiaCount - detectiveCount - doctorCount;

  const handleTotalPlayersChange = (value) => {
    setTotalPlayers(value);
    // Update max mafia count (mafia should be <= 1/3 of total players)
    const newMaxMafia = Math.floor(value / 3);
    setMaxMafia(newMaxMafia);
    // If current mafia count exceeds new max, adjust it
    if (mafiaCount > newMaxMafia) {
      setMafiaCount(newMaxMafia);
    }
  };

  const incrementTotalPlayers = () => {
    if (totalPlayers < 15) {
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

  const handleHostGame = async () => {
    if (!user) {
      showError('You need to log in to host a game', 'warning');
      
      if (Platform.OS === 'web') {
        setConfirmationData({
          title: 'Login Required',
          message: 'You need to log in to host a game.',
          onCancel: () => setConfirmationVisible(false),
          onConfirm: () => {
            setConfirmationVisible(false);
            navigation.navigate('Login');
          },
          confirmText: 'Login'
        });
        setConfirmationVisible(true);
      } else {
        Alert.alert(
          'Login Required',
          'You need to log in to host a game.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => navigation.navigate('Login') }
          ]
        );
      }
      return;
    }

    if (totalPlayers < 4) {
      showError('You need at least 4 players to start a game');
      return;
    }

    if (mafiaCount < 1 || mafiaCount > Math.floor(totalPlayers / 3)) {
      showError(`Mafia count should be between 1 and ${Math.floor(totalPlayers / 3)}`);
      return;
    }

    if (civilianCount < 1) {
      showError('You need at least one civilian in the game');
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
      
      setGameCode(gameCode);
      showError('Game created successfully! Share the code with your friends.', 'success');
      navigation.navigate('GameLobby', {
        gameCode,
        totalPlayers,
        mafiaCount,
        detectiveCount,
        doctorCount,
        isHost: true
      });
    } catch (error) {
      console.error('Error creating game:', error);
      showError('Failed to create game: ' + error.message);
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
            <Text style={styles.title}>Host Game</Text>
            
            {/* Game Settings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Game Settings</Text>
              
              {/* Host Information */}
              <View style={styles.hostInfoContainer}>
                <Icon name="stars" size={24} color={theme.colors.primary} />
                <Text style={styles.hostInfoText}>
                  You will be the host of this game (not counted in player count)
                </Text>
              </View>
              
              {/* Total Players Control */}
              <AnimatedControl
                label="Total Players"
                value={totalPlayers}
                minValue={4}
                maxValue={15}
                onIncrement={incrementTotalPlayers}
                onDecrement={decrementTotalPlayers}
                icon="group"
                description="Number of players excluding you as host (4-15)"
              />
              
                <View style={styles.roleControls}>
                  <AnimatedControl
                    label="Mafia Count"
                    value={mafiaCount}
                    minValue={1}
                    maxValue={Math.max(1, Math.floor(totalPlayers / 3))}
                    onIncrement={incrementMafia}
                    onDecrement={decrementMafia}
                    icon="security"
                  />
                  
                  <AnimatedControl
                    label="Detective Count"
                    value={detectiveCount}
                    minValue={0}
                    maxValue={2}
                    onIncrement={incrementDetective}
                    onDecrement={decrementDetective}
                    icon="visibility"
                  />
                  
                  <AnimatedControl
                    label="Doctor Count"
                    value={doctorCount}
                    minValue={0}
                    maxValue={2}
                    onIncrement={incrementDoctor}
                    onDecrement={decrementDoctor}
                    icon="healing"
                  />

                  <View style={styles.nonEditableControl}>
                    <View style={styles.controlHeader}>
                      <View style={styles.controlIconContainer}>
                        <Icon name="people" size={24} color={theme.colors.civilian} />
                      </View>
                      <View style={styles.controlLabelContainer}>
                        <Text style={styles.controlLabel}>Civilian Count</Text>
                        <Text style={styles.controlDescription}>
                          Automatically calculated based on other roles
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.civilianValueContainer}>
                      <Text style={styles.civilianValue}>{civilianCount}</Text>
                    </View>
                  </View>
                </View>
              
              {/* Role Summary */}
              <View style={styles.roleSummary}>
                <Text style={styles.roleSummaryTitle}>Role Summary Review</Text>
                <View style={styles.roleSummaryCards}>
                  <View style={styles.roleCard}>
                    <LinearGradient
                      colors={[`${theme.colors.mafia}20`, `${theme.colors.mafia}10`]}
                      style={styles.roleCardGradient}
                    >
                      <View style={[styles.roleIconContainer, { backgroundColor: `${theme.colors.mafia}30` }]}>
                        <Icon name="security" size={24} color={theme.colors.mafia} />
                      </View>
                      <Text style={[styles.roleName, { color: theme.colors.mafia }]}>Mafia</Text>
                      <View style={styles.roleCountContainer}>
                        <Text style={[styles.roleCount, { color: theme.colors.mafia }]}>{mafiaCount}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.roleCard}>
                    <LinearGradient
                      colors={[`${theme.colors.detective}20`, `${theme.colors.detective}10`]}
                      style={styles.roleCardGradient}
                    >
                      <View style={[styles.roleIconContainer, { backgroundColor: `${theme.colors.detective}30` }]}>
                        <Icon name="visibility" size={24} color={theme.colors.detective} />
                      </View>
                      <Text style={[styles.roleName, { color: theme.colors.detective }]}>Detective</Text>
                      <View style={styles.roleCountContainer}>
                        <Text style={[styles.roleCount, { color: theme.colors.detective }]}>{detectiveCount}</Text>
                        {detectiveCount === 2 && (
                          <Text style={styles.maxLabel}>MAX</Text>
                        )}
                      </View>
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.roleCard}>
                    <LinearGradient
                      colors={[`${theme.colors.doctor}20`, `${theme.colors.doctor}10`]}
                      style={styles.roleCardGradient}
                    >
                      <View style={[styles.roleIconContainer, { backgroundColor: `${theme.colors.doctor}30` }]}>
                        <Icon name="healing" size={24} color={theme.colors.doctor} />
                      </View>
                      <Text style={[styles.roleName, { color: theme.colors.doctor }]}>Doctor</Text>
                      <View style={styles.roleCountContainer}>
                        <Text style={[styles.roleCount, { color: theme.colors.doctor }]}>{doctorCount}</Text>
                        {doctorCount === 2 && (
                          <Text style={styles.maxLabel}>MAX</Text>
                        )}
                      </View>
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.roleCard}>
                    <LinearGradient
                      colors={[`${theme.colors.civilian}20`, `${theme.colors.civilian}10`]}
                      style={styles.roleCardGradient}
                    >
                      <View style={[styles.roleIconContainer, { backgroundColor: `${theme.colors.civilian}30` }]}>
                        <Icon name="people" size={24} color={theme.colors.civilian} />
                      </View>
                      <Text style={[styles.roleName, { color: theme.colors.civilian }]}>Civilian</Text>
                      <View style={styles.roleCountContainer}>
                        <Text style={[styles.roleCount, { color: theme.colors.civilian }]}>{civilianCount}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                </View>
                
                {civilianCount < 0 && (
                  <Text style={styles.errorText}>
                    Too many special roles selected! Reduce some role counts.
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
                leftIcon={<Icon name="videogame-asset" size={20} color={theme.colors.text.primary} />}
                fullWidth
              />
              
              <CustomButton
                title="BACK TO HOME"
                onPress={() => navigation.navigate('Home')}
                variant="outline"
                leftIcon={<Icon name="home" size={20} color={theme.colors.primary} />}
                style={styles.backButton}
                fullWidth
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="HostGame" />
      
      {/* Confirmation Modal for Web */}
      {confirmationVisible && confirmationData && (
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationTitle}>{confirmationData.title}</Text>
            <Text style={styles.confirmationText}>{confirmationData.message}</Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.cancelButton]} 
                onPress={confirmationData.onCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.confirmButton]} 
                onPress={confirmationData.onConfirm}
              >
                <Text style={styles.confirmButtonText}>{confirmationData.confirmText || 'Confirm'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
    backgroundColor: 'rgba(10, 25, 45, 0.7)',
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    ...theme.shadows.medium,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  roleDistributionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rolesContainer: {
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(40, 40, 60, 0.5)',
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.1)',
  },
  roleControls: {
    flexDirection: 'column',
    width: '100%',
  },
  roleSummary: {
    marginBottom: theme.spacing.xs,
  },
  roleSummaryTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
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
    width: 32,
    height: 32,
    borderRadius: 16,
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
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  controlContainer: {
    marginBottom: theme.spacing.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.15)',
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
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.small,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.1)',
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)',
    ...theme.shadows.medium,
  },
  controlButtonDisabled: {
    opacity: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(108, 99, 255, 0.1)',
  },
  controlValueContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  controlValue: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
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
  hostInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.lg,
  },
  hostInfoText: {
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.sizes.sm,
  },
  nonEditableControl: {
    marginBottom: theme.spacing.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.15)',
    ...theme.shadows.small,
  },
  civilianValueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  civilianValue: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.civilian,
  },
  confirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmationContainer: {
    backgroundColor: theme.colors?.background?.secondary || '#343544',
    borderRadius: theme.borderRadius?.lg || 16,
    padding: theme.spacing?.lg || 24,
    width: '80%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmationTitle: {
    fontSize: theme.fontSizes?.lg || 16,
    fontWeight: 'bold',
    color: theme.colors?.text?.primary || '#FFFFFF',
    marginBottom: theme.spacing?.md || 16,
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: theme.fontSizes?.md || 14,
    color: theme.colors?.text?.secondary || '#CCCCCC',
    marginBottom: theme.spacing?.lg || 24,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmationButton: {
    paddingVertical: theme.spacing?.sm || 8,
    paddingHorizontal: theme.spacing?.md || 16,
    borderRadius: theme.borderRadius?.md || 8,
    flex: 1,
    marginHorizontal: theme.spacing?.xs || 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors?.background?.tertiary || '#2A2A3A',
  },
  cancelButtonText: {
    color: theme.colors?.text?.primary || '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: theme.colors?.primary || '#BB86FC',
  },
  confirmButtonText: {
    color: theme.colors?.text?.primary || '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default HostGameScreen; 