import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';
import theme from '../theme';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModernBackground from '../components/ModernBackground';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const FeatureCard = ({ title, icon, color, children }) => {
  return (
    <View style={styles.featureCardContainer}>
      <LinearGradient
        colors={[`${color}40`, `${color}20`]}
        style={styles.featureCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.featureHeader}>
          <View style={[styles.featureIconContainer, { backgroundColor: `${color}60` }]}>
            <Icon name={icon} size={28} color={color} />
          </View>
          <Text style={styles.featureTitle}>{title}</Text>
        </View>
        <View style={styles.featureContent}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
};

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
            { paddingTop: insets.top + theme.spacing.md }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={theme.commonStyles.title}>Game Overview</Text>
          <Text style={theme.commonStyles.subtitle}>
            Learn the basics of the Mafia game and how to play.
          </Text>

          {/* Game Mechanics Section */}
          <FeatureCard 
            title="Game Mechanics" 
            icon="settings" 
            color={theme.colors.primary}
          >
            <View style={styles.bulletPointContainer}>
              <View style={styles.bulletPoint}>
                <Icon name="fiber-manual-record" size={12} color={theme.colors.primary} />
                <Text style={styles.bulletText}>
                  The game is played with two teams: the Mafia and the Civilians.
                </Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <Icon name="fiber-manual-record" size={12} color={theme.colors.primary} />
                <Text style={styles.bulletText}>
                  Each player is assigned a role, either a member of the Mafia or a Civilian.
                </Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <Icon name="fiber-manual-record" size={12} color={theme.colors.primary} />
                <Text style={styles.bulletText}>
                  The game alternates between Day and Night phases.
                </Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <Icon name="fiber-manual-record" size={12} color={theme.colors.primary} />
                <Text style={styles.bulletText}>
                  During the Day phase, players discuss and vote to eliminate a suspected Mafia member.
                </Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <Icon name="fiber-manual-record" size={12} color={theme.colors.primary} />
                <Text style={styles.bulletText}>
                  During the Night phase, the Mafia secretly chooses a player to eliminate.
                </Text>
              </View>
            </View>
          </FeatureCard>

          {/* Objectives Section */}
          <FeatureCard 
            title="Objectives" 
            icon="emoji-events" 
            color={theme.colors.warning}
          >
            <View style={styles.bulletPointContainer}>
              <View style={styles.bulletPoint}>
                <Icon name="fiber-manual-record" size={12} color={theme.colors.warning} />
                <Text style={styles.bulletText}>
                  Civilians aim to identify and eliminate all Mafia members.
                </Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <Icon name="fiber-manual-record" size={12} color={theme.colors.warning} />
                <Text style={styles.bulletText}>
                  Mafia members aim to eliminate enough Civilians to outnumber them.
                </Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <Icon name="fiber-manual-record" size={12} color={theme.colors.warning} />
                <Text style={styles.bulletText}>
                  Players must use strategy, deception, and teamwork to achieve their goals.
                </Text>
              </View>
            </View>
          </FeatureCard>

          {/* How to Play Section */}
          <FeatureCard 
            title="How to Play" 
            icon="play-circle-filled" 
            color={theme.colors.info}
          >
            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: `${theme.colors.info}60` }]}>
                  <Text style={[styles.stepNumberText, { color: theme.colors.info }]}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  Gather a group of players (ideally 6-12).
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: `${theme.colors.info}60` }]}>
                  <Text style={[styles.stepNumberText, { color: theme.colors.info }]}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Assign roles randomly to each player.
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: `${theme.colors.info}60` }]}>
                  <Text style={[styles.stepNumberText, { color: theme.colors.info }]}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Start the game with the Night phase, where the Mafia chooses a target.
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: `${theme.colors.info}60` }]}>
                  <Text style={[styles.stepNumberText, { color: theme.colors.info }]}>4</Text>
                </View>
                <Text style={styles.stepText}>
                  Transition to the Day phase, where players discuss and vote.
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: `${theme.colors.info}60` }]}>
                  <Text style={[styles.stepNumberText, { color: theme.colors.info }]}>5</Text>
                </View>
                <Text style={styles.stepText}>
                  Repeat the phases until one team wins.
                </Text>
              </View>
            </View>
          </FeatureCard>

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
  featureCardContainer: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    alignSelf: 'center',
    ...theme.shadows.medium,
  },
  featureCardGradient: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  featureTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  featureContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
  },
  bulletPointContainer: {
    marginVertical: theme.spacing.xs,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  bulletText: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    color: '#FFFFFF',
    marginLeft: theme.spacing.sm,
    //lineHeight: theme.typography.lineHeights.relaxed,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '500',
  },
  stepsContainer: {
    marginVertical: theme.spacing.xs,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  stepNumberText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  stepText: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    color: '#FFFFFF',
    //lineHeight: theme.typography.lineHeights.relaxed,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '500',
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