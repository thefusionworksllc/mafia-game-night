import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import BottomNavigation from '../components/BottomNavigation';

const GamePhasesScreen = ({ navigation }) => {
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
        <View style={styles.container}>
          <Text style={styles.title}>Game Phases</Text>
          <Text style={styles.description}>
            Understanding the day and night phases of the Mafia game.
          </Text>

          {/* Day Phase Section */}
          <View style={styles.flowCard}>
            <Text style={styles.flowTitle}>Day Phase:</Text>
            <Text style={styles.flowText}>
              • All players discuss and share information{'\n'}
              • Players vote to eliminate a suspected Mafia member{'\n'}
              • The player with the most votes is eliminated{'\n'}
              • Their role is revealed after elimination
            </Text>
          </View>

          {/* Night Phase Section */}
          <View style={styles.flowCard}>
            <Text style={styles.flowTitle}>Night Phase:</Text>
            <Text style={styles.flowText}>
              • Mafia members secretly choose a player to eliminate{'\n'}
              • Detective can investigate one player{'\n'}
              • Doctor can protect one player{'\n'}
              • Actions occur simultaneously
            </Text>
          </View>

          {/* Back to Home Button using CustomButton */}
          <CustomButton
            title="Back to Home"
            onPress={() => navigation.navigate('Home')}
            style={styles.backButton}
          />
        </View>
      </LinearGradient>
      <BottomNavigation navigation={navigation} activeScreen="Home" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    marginTop: theme.spacing.md,
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

export default GamePhasesScreen; 