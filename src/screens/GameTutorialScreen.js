import React from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import BottomNavigation from '../components/BottomNavigation';
import CustomButton from '../components/CustomButton';

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

const GameTutorialScreen = ({ navigation }) => {
  const roles = [
    {
      title: 'Civilian',
      description: 'Regular townspeople who must work together to identify and eliminate the Mafia. They vote during the day phase to eliminate suspected Mafia members.',
      icon: 'person',
      image: require('../../assets/civilian.png'),
    },
    {
      title: 'Mafia',
      description: 'Secret killers who eliminate one player each night. They must blend in with civilians during the day while secretly eliminating them at night.',
      icon: 'person-outline',
      image: require('../../assets/mafia.png'),
    },
    {
      title: 'Detective',
      description: "Can investigate one player each night to determine if they are a member of the Mafia. This information is crucial for the town's strategy.",
      icon: 'search',
      image: require('../../assets/detective.png'),
    },
    {
      title: 'Doctor',
      description: 'Can protect one player each night from being eliminated by the Mafia. Must choose wisely to save important town members.',
      icon: 'healing',
      image: require('../../assets/doctor.png'),
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
            <View style={styles.flowCard}>
              <Text style={styles.flowTitle}>Day Phase:</Text>
              <Text style={styles.flowText}>
                • All players discuss and share information{'\n'}
                • Players vote to eliminate a suspected Mafia member{'\n'}
                • The player with the most votes is eliminated{'\n'}
                • Their role is revealed after elimination
              </Text>
            </View>

            <View style={styles.flowCard}>
              <Text style={styles.flowTitle}>Night Phase:</Text>
              <Text style={styles.flowText}>
                • Mafia members secretly choose a player to eliminate{'\n'}
                • Detective can investigate one player{'\n'}
                • Doctor can protect one player{'\n'}
                • Actions occur simultaneously
              </Text>
            </View>

            <View style={styles.flowCard}>
              <Text style={styles.flowTitle}>Win Conditions:</Text>
              <Text style={styles.flowText}>
                • Town wins when all Mafia members are eliminated{'\n'}
                • Mafia wins when they equal or outnumber the town
              </Text>
            </View>
          </View>

          {/* Back to Home Button */}
          <CustomButton
            title="Back to Home"
            onPress={() => navigation.navigate('Home')}
            style={styles.backButton}
          />
        </ScrollView>
      </LinearGradient>
      <BottomNavigation navigation={navigation} activeScreen="Tutorial" />
    </ImageBackground>
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
  flowCard: {
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    borderRadius: 15,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  flowTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
  },
  flowText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  backButton: {
    marginTop: theme.spacing.lg,
  },
});

export default GameTutorialScreen; 