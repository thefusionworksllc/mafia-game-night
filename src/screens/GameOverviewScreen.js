import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  StatusBar
} from 'react-native';
import theme from '../theme';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModernBackground from '../components/ModernBackground';
import { LinearGradient } from 'expo-linear-gradient';

const GameOverviewScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <ScrollView
          style={theme.commonStyles.scrollContainer}
          contentContainerStyle={[
            theme.commonStyles.scrollContentContainer,
            { paddingTop: insets.top }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={theme.commonStyles.title}>Game Overview</Text>
          <Text style={theme.commonStyles.subtitle}>
            Learn the basics of the Mafia game and how to play.
          </Text>

          {/* Game Mechanics Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="settings" size={24} color={theme.colors.text.accent} />
              <Text style={styles.sectionTitle}>Game Mechanics</Text>
            </View>
            <View style={styles.card}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <Text style={styles.cardText}>
                  • The game is played with two teams: the Mafia and the Civilians.{'\n\n'}
                  • Each player is assigned a role, either a member of the Mafia or a Civilian.{'\n\n'}
                  • The game alternates between Day and Night phases.{'\n\n'}
                  • During the Day phase, players discuss and vote to eliminate a suspected Mafia member.{'\n\n'}
                  • During the Night phase, the Mafia secretly chooses a player to eliminate.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Objectives Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="emoji-events" size={24} color={theme.colors.text.accent} />
              <Text style={styles.sectionTitle}>Objectives</Text>
            </View>
            <View style={styles.card}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <Text style={styles.cardText}>
                  • Civilians aim to identify and eliminate all Mafia members.{'\n\n'}
                  • Mafia members aim to eliminate enough Civilians to outnumber them.{'\n\n'}
                  • Players must use strategy, deception, and teamwork to achieve their goals.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* How to Play Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="play-circle-filled" size={24} color={theme.colors.text.accent} />
              <Text style={styles.sectionTitle}>How to Play</Text>
            </View>
            <View style={styles.card}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <Text style={styles.cardText}>
                  1. Gather a group of players (ideally 6-12).{'\n\n'}
                  2. Assign roles randomly to each player.{'\n\n'}
                  3. Start the game with the Night phase, where the Mafia chooses a target.{'\n\n'}
                  4. Transition to the Day phase, where players discuss and vote.{'\n\n'}
                  5. Repeat the phases until one team wins.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="NEXT: ROLES & ABILITIES"
              onPress={() => navigation.navigate('RolesAndAbilities')}
              leftIcon={<Icon name="arrow-forward" size={20} color={theme.colors.text.primary} />}
              fullWidth
            />
            
            <CustomButton
              title="BACK TO HOME"
              onPress={() => navigation.navigate('Home')}
              variant="outline"
              style={styles.backButton}
              leftIcon={<Icon name="home" size={20} color={theme.colors.text.accent} />}
              fullWidth
            />
          </View>
        </ScrollView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="GameOverview" />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginLeft: theme.spacing.sm,
  },
  card: {
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  cardGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
  },
  cardText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeights.relaxed,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});

export default GameOverviewScreen; 