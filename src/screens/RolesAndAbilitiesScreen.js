import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';

const RoleSection = ({ title, description, icon, image }) => (
  <View style={styles.roleCard}>
    <View style={styles.roleHeader}>
      <Icon name={icon} size={24} color={theme.colors.text.accent} />
      <Text style={styles.roleTitle}>{title}</Text>
    </View>
    <Image source={image} style={styles.roleImage} />
    <Text style={styles.roleDescription}>{description}</Text>
  </View>
);

const RolesAndAbilitiesScreen = ({ navigation }) => {
  const roles = [
    {
      title: 'Civilian',
      description: 'Regular townspeople who must work together to identify and eliminate the Mafia. They vote during the day phase to eliminate suspected Mafia members.',
      icon: 'person',
      image: require('../../assets/roles/civilian.png'),
    },
    {
      title: 'Mafia',
      description: 'Secret killers who eliminate one player each night. They must blend in with civilians during the day while secretly eliminating them at night.',
      icon: 'person-outline',
      image: require('../../assets/roles/mafia.png'),
    },
    {
      title: 'Detective',
      description: "Can investigate one player each night to determine if they are a member of the Mafia. This information is crucial for the town's strategy.",
      icon: 'search',
      image: require('../../assets/roles/detective.png'),
    },
    {
      title: 'Doctor',
      description: 'Can protect one player each night from being eliminated by the Mafia. Must choose wisely to save important town members.',
      icon: 'healing',
      image: require('../../assets/roles/doctor.png'),
    },
  ];

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
            <Text style={styles.title}>Roles & Abilities</Text>
            <Text style={styles.description}>
              Discover different roles and their special abilities in the Mafia game.
            </Text>

            {/* Roles Section */}
            <View style={styles.rolesSection}>
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
});

export default RolesAndAbilitiesScreen; 