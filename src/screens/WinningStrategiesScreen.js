import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';

const WinningStrategiesScreen = ({ navigation }) => {
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
            <Text style={styles.title}>Winning Strategies</Text>
            <Text style={styles.description}>
              Tips and tricks to improve your gameplay and win more games.
            </Text>

          

            {/* Strategies Section */}
            <View style={styles.strategiesSection}>
              <Text style={styles.sectionTitle}>Strategies for Civilians:</Text>
              <View style={styles.strategyCard}>
                <Text style={styles.strategyText}>
                  • Communicate effectively with other players to share information.{'\n'}
                  • Pay attention to voting patterns and player behavior.{'\n'}
                  • Use logic and reasoning to identify suspicious players.{'\n'}
                  • Protect key roles like the Detective and Doctor during discussions.
                </Text>
              </View>

              <Text style={styles.sectionTitle}>Strategies for Mafia:</Text>
              <View style={styles.strategyCard}>
                <Text style={styles.strategyText}>
                  • Blend in with the civilians and avoid drawing attention.{'\n'}
                  • Create alibis and support other players to build trust.{'\n'}
                  • Coordinate with other Mafia members to eliminate key players.{'\n'}
                  • Use deception to mislead the Detective and other roles.
                </Text>
              </View>

              <Text style={styles.sectionTitle}>General Strategies:</Text>
              <View style={styles.strategyCard}>
                <Text style={styles.strategyText}>
                  • Always keep track of who has been eliminated and their roles.{'\n'}
                  • Adapt your strategy based on the roles remaining in the game.{'\n'}
                  • Stay calm and collected, even when under suspicion.{'\n'}
                  • Use your voting power wisely to influence the game's outcome.
                </Text>
              </View>
                {/* Winning Condition Section */}
            <Text style={styles.sectionTitle}>Winning Condition:</Text>
            <View style={styles.strategyCard}>
             
              <Text style={styles.conditionText}>
              • Civilians wins when all Mafia members are eliminated{'\n'}
              • Mafia wins when they equal or outnumber the Civilians
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
  strategiesSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
  },
  strategyCard: {
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    borderRadius: 15,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  strategyText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  conditionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
  },
  conditionText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  backButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxxl,
  },
});

export default WinningStrategiesScreen; 