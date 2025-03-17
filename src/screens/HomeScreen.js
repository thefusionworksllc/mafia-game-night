// src/screens/home/HomeScreen.js
import React, { useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import BottomNavigation from '../components/BottomNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import ModernBackground from '../components/ModernBackground';
import { useError } from '../context/ErrorContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const { showError } = useError();

  // Check if user is null and handle accordingly
  const isLoggedIn = !!user;

  // Check for success messages passed from other screens
  useEffect(() => {
    if (route.params?.showSuccess && route.params?.successMessage) {
      showError(route.params.successMessage, 'success');
      // Clean up params after showing message
      navigation.setParams({ showSuccess: undefined, successMessage: undefined });
    }
  }, [route.params?.showSuccess, route.params?.successMessage]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const tutorialSections = [
    {
      title: 'Game Overview',
      description: 'Learn the basics of Mafia game and how to play',
      icon: 'games',
      screen: 'GameOverview',
    },
    {
      title: 'Roles & Abilities',
      description: 'Discover different roles and their special abilities',
      icon: 'person',
      screen: 'RolesAndAbilities',
    },
    {
      title: 'Game Phases',
      description: 'Understanding day and night phases',
      icon: 'wb-sunny',
      screen: 'GamePhases',
    },
    {
      title: 'Winning Strategies',
      description: 'Tips and tricks to improve your gameplay',
      icon: 'emoji-events',
      screen: 'WinningStrategies',
    },
  ];

  const TutorialCard = ({ title, description, icon, screen }) => (
    <TouchableOpacity 
      style={styles.tutorialCard}
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={theme.gradients.card}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardIconContainer}>
          <Icon name={icon} size={28} color={theme.colors.primary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Icon name="chevron-right" size={20} color={theme.colors.text.secondary} />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground withAnimation={true}>
        <ScrollView 
          style={theme.commonStyles.scrollContainer}
          contentContainerStyle={theme.commonStyles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <View style={styles.appTitleContainer}>
              <Icon name="security" size={30} color={theme.colors.warning } />
              <Text style={styles.appTitle}>Mafia</Text>
            </View>
            <Text style={styles.welcomeText} >The Game Night</Text>
            {isLoggedIn ? (
              <View style={styles.userInfoContainer}>
                <Icon name="account-circle" size={20} color={theme.colors.primary} />
                <Text style={styles.loggedInText}>
                  Logged in as: <Text style={styles.username}>{user.displayName}</Text>
                </Text>
              </View>
            ) : (
              <CustomButton
                title="LOGIN / REGISTER"
                onPress={() => navigation.navigate('Login')}
                variant="outline"
                size="small"
                leftIcon={<Icon name="login" size={16} color={theme.colors.primary} />}
                style={styles.loginButton}
              />
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('HostGame')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={theme.gradients.accent}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="add-circle" size={24} color={theme.colors.text.primary} />
                  <Text style={styles.actionText}>HOST GAME</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('JoinGame')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={theme.gradients.accentSecondary}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="group-add" size={24} color={theme.colors.text.primary} />
                  <Text style={styles.actionText}>JOIN GAME</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tutorial Section */}
          <View style={styles.tutorialSection}>
            <Text style={styles.sectionTitle}>How to Play</Text>
            <Text style={styles.sectionSubtitle}>Learn the Mafia game mechanics</Text>
            <View style={styles.tutorialGrid}>
              {tutorialSections.map((section, index) => (
                <TutorialCard key={index} {...section} />
              ))}
            </View>
          </View>

          {/* Game History Section */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={() => navigation.navigate('GameHistory')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.historyGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="history" size={24} color={theme.colors.primary} />
                <Text style={styles.historyText}>VIEW GAME HISTORY</Text>
                <Icon name="chevron-right" size={20} color={theme.colors.text.secondary} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Profile Section - Only shown when logged in */}
          {isLoggedIn && (
            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Your Profile</Text>
              <TouchableOpacity 
                style={styles.historyButton}
                onPress={() => navigation.navigate('EditProfile')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={theme.gradients.card}
                  style={styles.historyGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="person" size={24} color={theme.colors.primary} />
                  <Text style={styles.historyText}>EDIT PROFILE</Text>
                  <Icon name="chevron-right" size={20} color={theme.colors.text.secondary} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  welcomeText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  appTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: theme.typography.sizes.display,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    // Text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    alignSelf: 'flex-start',
    ...theme.shadows.small,
  },
  loggedInText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  username: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  quickActionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  actionText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    marginLeft: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  tutorialSection: {
    marginBottom: theme.spacing.xl,
  },
  tutorialGrid: {
    marginTop: theme.spacing.sm,
  },
  tutorialCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  historySection: {
    marginBottom: theme.spacing.xl,
  },
  profileSection: {
    marginBottom: theme.spacing.xxl,
  },
  historyButton: {
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  historyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  historyText: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
});

export default HomeScreen;