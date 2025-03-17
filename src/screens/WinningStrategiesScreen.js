import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';
import ModernBackground from '../components/ModernBackground';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WinningStrategiesScreen = ({ navigation }) => {
  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <ScrollView 
          style={theme.commonStyles.scrollContainer}
          contentContainerStyle={theme.commonStyles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={theme.commonStyles.title}>Winning Strategies</Text>
          <Text style={theme.commonStyles.subtitle}>
            Tips and tricks to improve your gameplay and win more games.
          </Text>

          {/* Strategies for Civilians */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="people" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Strategies for Civilians</Text>
            </View>
            <View style={styles.card}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <Text style={styles.cardText}>
                  • Communicate effectively with other players to share information.{'\n\n'}
                  • Pay attention to voting patterns and player behavior.{'\n\n'}
                  • Use logic and reasoning to identify suspicious players.{'\n\n'}
                  • Protect key roles like the Detective and Doctor during discussions.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Strategies for Mafia */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="security" size={24} color={theme.colors.tertiary} />
              <Text style={styles.sectionTitle}>Strategies for Mafia</Text>
            </View>
            <View style={styles.card}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <Text style={styles.cardText}>
                  • Blend in with the civilians and avoid drawing attention.{'\n\n'}
                  • Create alibis and support other players to build trust.{'\n\n'}
                  • Coordinate with other Mafia members to eliminate key players.{'\n\n'}
                  • Use deception to mislead the Detective and other roles.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* General Strategies */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="psychology" size={24} color={theme.colors.info} />
              <Text style={styles.sectionTitle}>General Strategies</Text>
            </View>
            <View style={styles.card}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <Text style={styles.cardText}>
                  • Always keep track of who has been eliminated and their roles.{'\n\n'}
                  • Adapt your strategy based on the roles remaining in the game.{'\n\n'}
                  • Stay calm and collected, even when under suspicion.{'\n\n'}
                  • Use your voting power wisely to influence the game's outcome.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Winning Conditions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="emoji-events" size={24} color={theme.colors.warning} />
              <Text style={styles.sectionTitle}>Winning Conditions</Text>
            </View>
            <View style={styles.card}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <Text style={styles.cardText}>
                  • Civilians win when all Mafia members are eliminated.{'\n\n'}
                  • Mafia wins when they equal or outnumber the Civilians.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
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
      <BottomNavigation navigation={navigation} activeScreen="Home" />
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

export default WinningStrategiesScreen; 