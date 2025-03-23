import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';
import ModernBackground from '../components/ModernBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const RoleCard = ({ title, description, icon, image, color }) => (
  <View style={styles.roleCardContainer}>
    <LinearGradient
      colors={[`${color}40`, `${color}20`]}
      style={styles.cardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.roleHeader}>
        <View style={[styles.roleIconContainer, { backgroundColor: `${color}60` }]}>
          <Icon name={icon} size={28} color={color} />
        </View>
        <Text style={styles.roleTitle}>{title}</Text>
      </View>
      <Image source={image} style={styles.roleImage} resizeMode="cover" />
      <View style={styles.descriptionContainer}>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>
    </LinearGradient>
  </View>
);

const PhaseCard = ({ title, icon, color, children }) => (
  <View style={styles.phaseCardContainer}>
    <LinearGradient
      colors={[`${color}40`, `${color}20`]}
      style={styles.cardGradient}
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

const WinConditionCard = ({ title, icon, color, description }) => (
  <View style={styles.winCardContainer}>
    <LinearGradient
      colors={[`${color}40`, `${color}20`]}
      style={styles.cardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.winHeader}>
        <View style={[styles.winIconContainer, { backgroundColor: `${color}60` }]}>
          <Icon name={icon} size={28} color={color} />
        </View>
        <Text style={styles.winTitle}>{title}</Text>
      </View>
      <View style={styles.winContent}>
        <Text style={styles.winDescription}>{description}</Text>
      </View>
    </LinearGradient>
  </View>
);

const GameTutorialScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  const roles = [
    {
      title: 'Mafia',
      description: 'During the night phase, Mafia members secretly choose a civilian to eliminate. During the day phase, they must blend in and avoid suspicion.',
      icon: 'security',
      image: require('../../assets/roles/mafia.png'),
      color: theme.colors.mafia
    },
    {
      title: 'Detective',
      description: 'During the night phase, the Detective can investigate one player to determine if they are a member of the Mafia or a Civilian.',
      icon: 'visibility',
      image: require('../../assets/roles/detective.png'),
      color: theme.colors.detective
    },
    {
      title: 'Doctor',
      description: 'During the night phase, the Doctor can choose one player to protect from elimination. The Doctor can save themselves.',
      icon: 'healing',
      image: require('../../assets/roles/doctor.png'),
      color: theme.colors.doctor
    },
    {
      title: 'Civilian',
      description: 'Civilians must work together during the day phase to identify and vote out Mafia members before they are outnumbered.',
      icon: 'people',
      image: require('../../assets/roles/civilian.png'),
      color: theme.colors.civilian
    }
  ];

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
          <Text style={theme.commonStyles.title}>Game Tutorial</Text>
          <Text style={theme.commonStyles.subtitle}>
            Learn how to play the Mafia game with this comprehensive guide.
          </Text>

          {/* Roles Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Game Roles</Text>
            {roles.map((role, index) => (
              <RoleCard
                key={index}
                title={role.title}
                description={role.description}
                icon={role.icon}
                image={role.image}
                color={role.color}
              />
            ))}
          </View>

          {/* Game Flow Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Game Flow</Text>
            <PhaseCard 
              title="Day Phase" 
              icon="wb-sunny" 
              color="#FFC107"
            >
              <Text style={styles.phaseDescription}>
                During the day, all players discuss who they suspect might be Mafia. At the end of the discussion, everyone votes on who to eliminate. The player with the most votes is eliminated from the game.
              </Text>
            </PhaseCard>
            
            <PhaseCard 
              title="Night Phase" 
              icon="brightness-3" 
              color="#5C6BC0"
            >
              <Text style={styles.phaseDescription}>
                During the night, the Mafia secretly chooses a player to eliminate. The Detective can investigate one player, and the Doctor can protect one player from elimination.
              </Text>
            </PhaseCard>
          </View>

          {/* Winning Conditions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Winning Conditions</Text>
            <WinConditionCard
              title="Civilians Win"
              icon="people"
              color={theme.colors.primary}
              description="If all Mafia members are eliminated, the Civilians win the game."
            />
            
            <WinConditionCard
              title="Mafia Wins"
              icon="security"
              color={theme.colors.tertiary}
              description="If the number of Mafia equals or exceeds the number of Civilians, the Mafia wins the game."
            />
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
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  roleCardContainer: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    alignSelf: 'center',
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  cardGradient: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  roleTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  roleImage: {
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  roleDescription: {
    fontSize: theme.typography.sizes.md,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '500',
  },
  phaseCardContainer: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    alignSelf: 'center',
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  phaseDescription: {
    fontSize: theme.typography.sizes.md,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '500',
  },
  winCardContainer: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    alignSelf: 'center',
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  winHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  winIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  winTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  winContent: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  winDescription: {
    fontSize: theme.typography.sizes.md,
    color: '#FFFFFF',
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

export default GameTutorialScreen; 