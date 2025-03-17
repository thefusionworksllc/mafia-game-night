import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';
import ModernBackground from '../components/ModernBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const PhaseCard = ({ title, icon, color, children }) => (
  <View style={styles.phaseCardContainer}>
    <LinearGradient
      colors={[`${color}40`, `${color}20`]}
      style={styles.phaseCardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.phaseHeader}>
        <View style={[styles.phaseIconContainer, { backgroundColor: `${color}60` }]}>
          <Icon name={icon} size={28} color={color} />
        </View>
        <Text style={styles.phaseTitle}>{title}</Text>
      </View>
      <View style={styles.phaseContent}>
        {children}
      </View>
    </LinearGradient>
  </View>
);

const BulletPoint = ({ text, color }) => (
  <View style={styles.bulletPoint}>
    <Icon name="fiber-manual-record" size={12} color={color} />
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

const GamePhasesScreen = ({ navigation }) => {
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
          <Text style={theme.commonStyles.title}>Game Phases</Text>
          <Text style={theme.commonStyles.subtitle}>
            Understanding the day and night phases of the Mafia game.
          </Text>

          {/* Day Phase Section */}
          <PhaseCard 
            title="Day Phase" 
            icon="wb-sunny" 
            color="#FFC107"
          >
            <View style={styles.bulletPointContainer}>
              <BulletPoint 
                text="All players discuss and share information" 
                color="#FFC107" 
              />
              <BulletPoint 
                text="Players vote to eliminate a suspected Mafia member" 
                color="#FFC107" 
              />
              <BulletPoint 
                text="The player with the most votes is eliminated" 
                color="#FFC107" 
              />
              <BulletPoint 
                text="Their role is revealed after elimination" 
                color="#FFC107" 
              />
            </View>
          </PhaseCard>

          {/* Night Phase Section */}
          <PhaseCard 
            title="Night Phase" 
            icon="brightness-3" 
            color="#5C6BC0"
          >
            <View style={styles.bulletPointContainer}>
              <BulletPoint 
                text="Mafia members secretly choose a player to eliminate" 
                color="#5C6BC0" 
              />
              <BulletPoint 
                text="Detective can investigate one player" 
                color="#5C6BC0" 
              />
              <BulletPoint 
                text="Doctor can protect one player" 
                color="#5C6BC0" 
              />
              <BulletPoint 
                text="Actions occur simultaneously" 
                color="#5C6BC0" 
              />
            </View>
          </PhaseCard>

          {/* Game Flow Section */}
          <PhaseCard 
            title="Game Flow" 
            icon="loop" 
            color={theme.colors.primary}
          >
            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: `${theme.colors.primary}60` }]}>
                  <Text style={[styles.stepNumberText, { color: theme.colors.primary }]}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  The game starts with the Night phase
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: `${theme.colors.primary}60` }]}>
                  <Text style={[styles.stepNumberText, { color: theme.colors.primary }]}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Alternate between Night and Day phases
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: `${theme.colors.primary}60` }]}>
                  <Text style={[styles.stepNumberText, { color: theme.colors.primary }]}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Each phase allows specific actions for different roles
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: `${theme.colors.primary}60` }]}>
                  <Text style={[styles.stepNumberText, { color: theme.colors.primary }]}>4</Text>
                </View>
                <Text style={styles.stepText}>
                  Continue until one team achieves their winning condition
                </Text>
              </View>
            </View>
          </PhaseCard>

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
  phaseCardContainer: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    alignSelf: 'center',
    ...theme.shadows.medium,
  },
  phaseCardGradient: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  phaseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  phaseTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  phaseContent: {
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
   // lineHeight: theme.typography.lineHeights.relaxed,
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

export default GamePhasesScreen; 