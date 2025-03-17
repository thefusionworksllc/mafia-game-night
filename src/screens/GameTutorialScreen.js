import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';
import ModernBackground from '../components/ModernBackground';

const RoleSection = ({ title, description, icon, image }) => (
  <View style={styles.roleCard}>
    <LinearGradient
      colors={theme.gradients.card}
      style={styles.cardGradient}
    >
      <View style={styles.roleHeader}>
        <Icon name={icon} size={24} color={theme.colors.text.accent} />
        <Text style={styles.roleTitle}>{title}</Text>
      </View>
      <Image source={image} style={styles.roleImage} />
      <Text style={styles.roleDescription}>{description}</Text>
    </LinearGradient>
  </View>
);

const GameTutorialScreen = ({ navigation }) => {
  const roles = [
    {
      title: 'Mafia',
      description: 'During the night phase, Mafia members secretly choose a civilian to eliminate. During the day phase, they must blend in and avoid suspicion.',
      icon: 'security',
      image: require('../../assets/mafia.png')
    },
    {
      title: 'Detective',
      description: 'During the night phase, the Detective can investigate one player to determine if they are a member of the Mafia or a Civilian.',
      icon: 'search',
      image: require('../../assets/detective.png')
    },
    {
      title: 'Doctor',
      description: 'During the night phase, the Doctor can choose one player to protect from elimination. The Doctor can save themselves.',
      icon: 'healing',
      image: require('../../assets/doctor.png')
    },
    {
      title: 'Civilian',
      description: 'Civilians must work together during the day phase to identify and vote out Mafia members before they are outnumbered.',
      icon: 'people',
      image: require('../../assets/civilian.png')
    }
  ];

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Game Tutorial</Text>

          {/* Roles Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Game Roles</Text>
            {roles.map((role, index) => (
              <RoleSection
                key={index}
                title={role.title}
                description={role.description}
                icon={role.icon}
                image={role.image}
              />
            ))}
          </View>

          {/* Game Flow Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Game Flow</Text>
            <View style={styles.phaseCard}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <View style={styles.phaseHeader}>
                  <Icon name="wb-sunny" size={24} color="#FFC107" />
                  <Text style={styles.phaseTitle}>Day Phase</Text>
                </View>
                <Text style={styles.phaseDescription}>
                  During the day, all players discuss who they suspect might be Mafia. At the end of the discussion, everyone votes on who to eliminate. The player with the most votes is eliminated from the game.
                </Text>
              </LinearGradient>
            </View>
            
            <View style={styles.phaseCard}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <View style={styles.phaseHeader}>
                  <Icon name="brightness-3" size={24} color="#5C6BC0" />
                  <Text style={styles.phaseTitle}>Night Phase</Text>
                </View>
                <Text style={styles.phaseDescription}>
                  During the night, the Mafia secretly chooses a player to eliminate. The Detective can investigate one player, and the Doctor can protect one player from elimination.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Winning Conditions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Winning Conditions</Text>
            <View style={styles.winCard}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <View style={styles.winHeader}>
                  <Icon name="people" size={24} color={theme.colors.primary} />
                  <Text style={styles.winTitle}>Civilians Win</Text>
                </View>
                <Text style={styles.winDescription}>
                  If all Mafia members are eliminated, the Civilians win the game.
                </Text>
              </LinearGradient>
            </View>
            
            <View style={styles.winCard}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.cardGradient}
              >
                <View style={styles.winHeader}>
                  <Icon name="security" size={24} color={theme.colors.tertiary} />
                  <Text style={styles.winTitle}>Mafia Wins</Text>
                </View>
                <Text style={styles.winDescription}>
                  If the number of Mafia equals or exceeds the number of Civilians, the Mafia wins the game.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Back to Home Button */}
          <CustomButton
            title="Back to Home"
            onPress={() => navigation.navigate('Home')}
            style={styles.backButton}
          />
        </ScrollView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 80,
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.lg,
  },
  roleCard: {
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    borderRadius: 15,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  roleTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginLeft: theme.spacing.sm,
  },
  roleImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginVertical: theme.spacing.sm,
  },
  roleDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  phaseCard: {
    marginBottom: theme.spacing.md,
  },
  cardGradient: {
    borderRadius: 15,
    padding: theme.spacing.lg,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  phaseTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginLeft: theme.spacing.sm,
  },
  phaseDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  winCard: {
    marginBottom: theme.spacing.md,
  },
  winHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  winTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginLeft: theme.spacing.sm,
  },
  winDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  backButton: {
    marginTop: theme.spacing.lg,
  },
});

export default GameTutorialScreen; 