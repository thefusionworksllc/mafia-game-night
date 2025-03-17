import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';
import ModernBackground from '../components/ModernBackground';

const GamePhasesScreen = ({ navigation }) => {
  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <ScrollView 
          style={theme.commonStyles.scrollContainer}
          contentContainerStyle={theme.commonStyles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={theme.commonStyles.title}>Game Phases</Text>
          <Text style={theme.commonStyles.subtitle}>
            Understanding the day and night phases of the Mafia game.
          </Text>

          {/* Day Phase Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="wb-sunny" size={24} color="#FFC107" />
              <Text style={styles.sectionTitle}>Day Phase</Text>
            </View>
            <View style={styles.card}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <Text style={styles.cardText}>
                  • All players discuss and share information{'\n\n'}
                  • Players vote to eliminate a suspected Mafia member{'\n\n'}
                  • The player with the most votes is eliminated{'\n\n'}
                  • Their role is revealed after elimination
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Night Phase Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="brightness-3" size={24} color="#5C6BC0" />
              <Text style={styles.sectionTitle}>Night Phase</Text>
            </View>
            <View style={styles.card}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <Text style={styles.cardText}>
                  • Mafia members secretly choose a player to eliminate{'\n\n'}
                  • Detective can investigate one player{'\n\n'}
                  • Doctor can protect one player{'\n\n'}
                  • Actions occur simultaneously
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Game Flow Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="loop" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Game Flow</Text>
            </View>
            <View style={styles.card}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <Text style={styles.cardText}>
                  1. The game starts with the Night phase{'\n\n'}
                  2. Alternate between Night and Day phases{'\n\n'}
                  3. Each phase allows specific actions for different roles{'\n\n'}
                  4. Continue until one team achieves their winning condition
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="NEXT: WINNING STRATEGIES"
              onPress={() => navigation.navigate('WinningStrategies')}
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
      <BottomNavigation navigation={navigation} activeScreen="GamePhases" />
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

export default GamePhasesScreen; 