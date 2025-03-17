import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/LoadingSpinner';
import BottomNavigation from '../../components/BottomNavigation';
import ModernBackground from '../../components/ModernBackground';
import CustomButton from '../../components/CustomButton';

const StatCard = ({ title, value, icon, color = theme.colors.primary }) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={[`${color}20`, `${color}10`]}
      style={styles.statCardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}30` }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </LinearGradient>
  </View>
);

const GameStatsScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        console.log('User not authenticated');
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      console.log('Fetching stats for user ID:', user.uid); // Debug message

      try {
        const userStats = await userService.getUserStats();
        console.log('Fetched user stats:', userStats); // Debug message
        setStats(userStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <View style={theme.commonStyles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ModernBackground>
          <LoadingSpinner />
        </ModernBackground>
        <BottomNavigation navigation={navigation} activeScreen="Settings" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={theme.commonStyles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ModernBackground>
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={60} color={theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <CustomButton
              title="GO BACK"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.backButton}
              leftIcon={<Icon name="arrow-back" size={20} color={theme.colors.text.accent} />}
            />
          </View>
        </ModernBackground>
        <BottomNavigation navigation={navigation} activeScreen="Settings" />
      </View>
    );
  }

  const winRate = stats?.gamesPlayed > 0
    ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1)
    : '0.0';

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <ScrollView 
          style={theme.commonStyles.scrollContainer}
          contentContainerStyle={theme.commonStyles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={theme.commonStyles.title}>Game Statistics</Text>
          <Text style={theme.commonStyles.subtitle}>
            Track your performance and game history
          </Text>
          
          <View style={styles.statsOverview}>
            <View style={styles.overviewCard}>
              <LinearGradient
                colors={theme.gradients.card}
                style={styles.overviewGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewLabel}>Games Played</Text>
                  <Text style={styles.overviewValue}>{stats?.gamesPlayed || 0}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewLabel}>Win Rate</Text>
                  <Text style={styles.overviewValue}>{winRate}%</Text>
                </View>
              </LinearGradient>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Role Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Civilian"
              value={stats?.roleStats?.civilian || 0}
              icon="person"
              color={theme.colors.primary}
            />
            <StatCard
              title="Mafia"
              value={stats?.roleStats?.mafia || 0}
              icon="security"
              color={theme.colors.tertiary}
            />
            <StatCard
              title="Detective"
              value={stats?.roleStats?.detective || 0}
              icon="search"
              color={theme.colors.info}
            />
            <StatCard
              title="Doctor"
              value={stats?.roleStats?.doctor || 0}
              icon="healing"
              color={theme.colors.success}
            />
          </View>
          
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Games Won"
              value={stats?.gamesWon || 0}
              icon="emoji-events"
              color={theme.colors.warning}
            />
            <StatCard
              title="Games Hosted"
              value={stats?.gamesHosted || 0}
              icon="grade"
              color={theme.colors.accent}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <CustomButton
              title="BACK TO SETTINGS"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.backButton}
              leftIcon={<Icon name="arrow-back" size={20} color={theme.colors.text.accent} />}
              fullWidth
            />
          </View>
        </ScrollView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="Settings" />
    </View>
  );
};

const styles = StyleSheet.create({
  statsOverview: {
    marginVertical: theme.spacing.lg,
  },
  overviewCard: {
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  overviewGradient: {
    flexDirection: 'row',
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  overviewValue: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  statCardGradient: {
    padding: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.large,
    height: 140,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  statTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginVertical: theme.spacing.xs,
    textAlign: 'center',
  },
  statValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});

export default GameStatsScreen; 