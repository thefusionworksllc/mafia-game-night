// src/screens/home/HomeScreen.js
import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import BottomNavigation from '../components/BottomNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();

  // Check if user is null and handle accordingly
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not logged in. Please log in.</Text>
      </View>
    );
  }

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
    >
      <View style={styles.cardGradient}>
        <Icon name={icon} size={32} color={theme.colors.text.accent} style={styles.cardIcon} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Icon name="chevron-right" size={24} color={theme.colors.text.secondary} />
      </View>
    </TouchableOpacity>
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
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={theme.commonStyles.container}>
          <ScrollView style={styles.scrollContainer}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.username}>{user.displayName}</Text>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <View style={styles.quickActionsBackground}>
                <View style={styles.quickActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('HostGame')}
                  >
                    <View style={styles.actionGradient}>
                      <Icon name="add-circle" size={24} color={theme.colors.primary} />
                      <Text style={styles.actionText}>Host</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('JoinGame')}
                  >
                    <View style={styles.actionGradient}>
                      <Icon name="group-add" size={24} color={theme.colors.primary} />
                      <Text style={styles.actionText}>Join</Text>
                    </View>
                  </TouchableOpacity>
                </View>
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
          </ScrollView>
        </View>
      </LinearGradient>
      <BottomNavigation navigation={navigation} activeScreen="Home" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  welcomeSection: {
    marginTop: theme.spacing.xl * 2,
    marginBottom: theme.spacing.xl,
  },
  welcomeText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
  },
  username: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  quickActionsContainer: {
    marginBottom: theme.spacing.xl * 2,
  },
  quickActionsBackground: {
    borderRadius: 12,
    padding: theme.spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.32)', // Dark background
    borderRadius: 30,
    paddingHorizontal: theme.spacing.md,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: 12,
  },
  actionText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  tutorialSection: {
    marginBottom: theme.spacing.xl * 2,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  tutorialGrid: {
    gap: theme.spacing.md,
  },
  tutorialCard: {
    marginBottom: theme.spacing.md,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: Add a slight background to the card
  },
  cardIcon: {
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
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;