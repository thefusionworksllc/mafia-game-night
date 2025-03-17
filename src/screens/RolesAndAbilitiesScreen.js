import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import ModernBackground from '../components/ModernBackground';
import { StatusBar } from 'react-native';

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

const RolesAndAbilitiesScreen = ({ navigation }) => {
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Roles & Abilities</Text>
            <Text style={styles.description}>
              Discover different roles and their special abilities in the Mafia game.
            </Text>

            {/* Roles Section */}
            <View style={styles.rolesSection}>
              <Text style={styles.sectionTitle}>Game Roles</Text>
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

            {/* Back to Home Button */}
            <CustomButton
              title="Back to Home"
              onPress={() => navigation.navigate('Home')}
              style={styles.backButton}
            />
          </View>
        </ScrollView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="Home" />
    </View>
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
  },
  description: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  rolesSection: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
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
  backButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxxl,
  },
  cardGradient: {
    borderRadius: 15,
    padding: theme.spacing.lg,
  },
});

export default RolesAndAbilitiesScreen; 