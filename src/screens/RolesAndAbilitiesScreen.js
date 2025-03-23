import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import ModernBackground from '../components/ModernBackground';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

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

const RolesAndAbilitiesScreen = ({ navigation }) => {
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
          <Text style={theme.commonStyles.title}>Roles & Abilities</Text>
          <Text style={theme.commonStyles.subtitle}>
            Discover different roles and their special abilities in the Mafia game.
          </Text>

          {/* Roles Section */}
          <View style={styles.rolesSection}>
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

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="NEXT: GAME PHASES"
              onPress={() => navigation.navigate('GamePhases')}
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
      <BottomNavigation navigation={navigation} activeScreen="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  rolesSection: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  roleCardContainer: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
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
    marginTop: theme.spacing.sm,
  },
  roleDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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

export default RolesAndAbilitiesScreen; 