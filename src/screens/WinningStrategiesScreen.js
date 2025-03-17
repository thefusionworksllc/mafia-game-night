import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';
import ModernBackground from '../components/ModernBackground';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const StrategyCard = ({ title, icon, color, children }) => (
  <View style={styles.strategyCardContainer}>
    <LinearGradient
      colors={[`${color}40`, `${color}20`]}
      style={styles.strategyCardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.strategyHeader}>
        <View style={[styles.strategyIconContainer, { backgroundColor: `${color}60` }]}>
          <Icon name={icon} size={28} color={color} />
        </View>
        <Text style={styles.strategyTitle}>{title}</Text>
      </View>
      <View style={styles.strategyContent}>
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

const WinningStrategiesScreen = ({ navigation }) => {
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
          <Text style={theme.commonStyles.title}>Winning Strategies</Text>
          <Text style={theme.commonStyles.subtitle}>
            Tips and tricks to improve your gameplay and win more games.
          </Text>

          {/* Strategies for Civilians */}
          <StrategyCard 
            title="Strategies for Civilians" 
            icon="people" 
            color={theme.colors.primary}
          >
            <View style={styles.bulletPointContainer}>
              <BulletPoint 
                text="Communicate effectively with other players to share information." 
                color={theme.colors.primary} 
              />
              <BulletPoint 
                text="Pay attention to voting patterns and player behavior." 
                color={theme.colors.primary} 
              />
              <BulletPoint 
                text="Use logic and reasoning to identify suspicious players." 
                color={theme.colors.primary} 
              />
              <BulletPoint 
                text="Protect key roles like the Detective and Doctor during discussions." 
                color={theme.colors.primary} 
              />
            </View>
          </StrategyCard>

          {/* Strategies for Mafia */}
          <StrategyCard 
            title="Strategies for Mafia" 
            icon="security" 
            color={theme.colors.tertiary}
          >
            <View style={styles.bulletPointContainer}>
              <BulletPoint 
                text="Blend in with the civilians and avoid drawing attention." 
                color={theme.colors.tertiary} 
              />
              <BulletPoint 
                text="Create alibis and support other players to build trust." 
                color={theme.colors.tertiary} 
              />
              <BulletPoint 
                text="Coordinate with other Mafia members to eliminate key players." 
                color={theme.colors.tertiary} 
              />
              <BulletPoint 
                text="Use deception to mislead the Detective and other roles." 
                color={theme.colors.tertiary} 
              />
            </View>
          </StrategyCard>

          {/* General Strategies */}
          <StrategyCard 
            title="General Strategies" 
            icon="psychology" 
            color={theme.colors.info}
          >
            <View style={styles.bulletPointContainer}>
              <BulletPoint 
                text="Always keep track of who has been eliminated and their roles." 
                color={theme.colors.info} 
              />
              <BulletPoint 
                text="Adapt your strategy based on the roles remaining in the game." 
                color={theme.colors.info} 
              />
              <BulletPoint 
                text="Stay calm and collected, even when under suspicion." 
                color={theme.colors.info} 
              />
              <BulletPoint 
                text="Use your voting power wisely to influence the game's outcome." 
                color={theme.colors.info} 
              />
            </View>
          </StrategyCard>

          {/* Winning Conditions */}
          <StrategyCard 
            title="Winning Conditions" 
            icon="emoji-events" 
            color={theme.colors.warning}
          >
            <View style={styles.winConditionsContainer}>
              <View style={styles.winCondition}>
                <View style={[styles.teamBadge, { backgroundColor: `${theme.colors.primary}60` }]}>
                  <Icon name="people" size={20} color={theme.colors.primary} />
                  <Text style={[styles.teamText, { color: theme.colors.primary }]}>Civilians</Text>
                </View>
                <Text style={styles.conditionText}>
                  Win when all Mafia members are eliminated.
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.winCondition}>
                <View style={[styles.teamBadge, { backgroundColor: `${theme.colors.tertiary}60` }]}>
                  <Icon name="security" size={20} color={theme.colors.tertiary} />
                  <Text style={[styles.teamText, { color: theme.colors.tertiary }]}>Mafia</Text>
                </View>
                <Text style={styles.conditionText}>
                  Win when they equal or outnumber the Civilians.
                </Text>
              </View>
            </View>
          </StrategyCard>

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
  strategyCardContainer: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    alignSelf: 'center',
    ...theme.shadows.medium,
  },
  strategyCardGradient: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
  },
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  strategyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  strategyTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  strategyContent: {
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
    lineHeight: theme.typography.lineHeights.relaxed,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '500',
  },
  winConditionsContainer: {
    marginVertical: theme.spacing.xs,
  },
  winCondition: {
    marginBottom: theme.spacing.md,
  },
  teamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
  },
  teamText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    marginLeft: theme.spacing.xs,
  },
  conditionText: {
    fontSize: theme.typography.sizes.md,
    color: '#FFFFFF',
    lineHeight: theme.typography.lineHeights.relaxed,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: theme.spacing.md,
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