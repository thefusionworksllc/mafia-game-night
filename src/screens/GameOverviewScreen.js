import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';

const GameOverviewScreen = ({ navigation }) => {
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Game Overview</Text>
            <Text style={styles.description}>
              Learn the basics of the Mafia game and how to play.
            </Text>

            {/* Game Mechanics Section */}
            <View style={styles.mechanicsSection}>
              <Text style={styles.sectionTitle}>Game Mechanics:</Text>
              <View style={styles.strategyCard}>
                <Text style={styles.mechanicsText}>
                  • The game is played with two teams: the Mafia and the Civilians.{'\n'}
                  • Each player is assigned a role, either a member of the Mafia or a Civilian.{'\n'}
                  • The game alternates between Day and Night phases.{'\n'}
                  • During the Day phase, players discuss and vote to eliminate a suspected Mafia member.{'\n'}
                  • During the Night phase, the Mafia secretly chooses a player to eliminate.
                </Text>
              </View>
            </View>

            {/* Objectives Section */}
            <View style={styles.objectivesSection}>
              <Text style={styles.sectionTitle}>Objectives:</Text>
              <View style={styles.strategyCard}>
                <Text style={styles.objectivesText}>
                  • Civilians aim to identify and eliminate all Mafia members.{'\n'}
                  • Mafia members aim to eliminate enough Civilians to outnumber them.{'\n'}
                  • Players must use strategy, deception, and teamwork to achieve their goals.
                </Text>
              </View>
            </View>

            {/* How to Play Section */}
            <View style={styles.howToPlaySection}>
              <Text style={styles.sectionTitle}>How to Play:</Text>
              <View style={styles.strategyCard}>
                <Text style={styles.howToPlayText}>
                  1. Gather a group of players (ideally 6-12).{'\n'}
                  2. Assign roles randomly to each player.{'\n'}
                  3. Start the game with the Night phase, where the Mafia chooses a target.{'\n'}
                  4. Transition to the Day phase, where players discuss and vote.{'\n'}
                  5. Repeat the phases until one team wins.
                </Text>
              </View>
            </View>

            {/* Back to Home Button */}
            <CustomButton
              title="Back to Home"
              onPress={() => navigation.navigate('Home')}
              style={styles.backButton}
            />
          </View>
        </ScrollView>
      </LinearGradient>
      <BottomNavigation navigation={navigation} activeScreen="Home" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
  },
  mechanicsSection: {
    marginBottom: theme.spacing.xl,
  },
  mechanicsText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  objectivesSection: {
    marginBottom: theme.spacing.xl,
  },
  objectivesText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  howToPlaySection: {
    marginBottom: theme.spacing.xl,
  },
  howToPlayText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  strategyCard: {
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    borderRadius: 15,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  backButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxxl,
  },
});

export default GameOverviewScreen; 